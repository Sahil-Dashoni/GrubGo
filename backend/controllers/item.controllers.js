import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price, description, isAvailable } = req.body
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }
        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: "shop not found" })
        }
        const item = await Item.create({
            name, category, foodType, price, description, isAvailable: true, image, shop: shop._id
        })

        shop.items.push(item._id)
        await shop.save()
        await shop.populate("owner")
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        return res.status(201).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `add item error ${error}` })
    }
}

export const toggleStock = async (req, res) => {
    try {
        const { itemId } = req.params;
        
        // Populate the shop to access the owner field
        const item = await Item.findById(itemId).populate('shop');
        if (!item) return res.status(404).json({ message: "Item not found" });

        // Ownership Check: Ensure the logged-in user owns this shop
        if (item.shop.owner.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: You do not own this shop" });
        }

        item.isAvailable = !item.isAvailable;
        await item.save();

        // Real-time broadcast
        const io = req.app.get('io');
        if (io) {
            io.emit('itemStockUpdate', { itemId: item._id, isAvailable: item.isAvailable });
        }

        return res.status(200).json({ message: "Stock status updated", isAvailable: item.isAvailable });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const editItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        // 1. Destructure description from body
        const { name, category, foodType, price, description } = req.body; 

        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        // 2. Update fields
        item.name = name || item.name;
        item.category = category || item.category;
        item.foodType = foodType || item.foodType;
        item.price = price || item.price;
        item.description = description || item.description; // Update description

        if (req.file) {
            item.image = await uploadOnCloudinary(req.file.path);
        }

        await item.save();
        
        // Return updated shop data to refresh owner side
        const shop = await Shop.findOne({ owner: req.userId }).populate("items");
        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json({ message: `Edit error: ${error.message}` });
    }
};

export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        return res.status(200).json(item)
    } catch (error) {
        return res.status(500).json({ message: `get item error ${error}` })
    }
}

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findByIdAndDelete(itemId)
        if (!item) {
            return res.status(400).json({ message: "item not found" })
        }
        const shop = await Shop.findOne({ owner: req.userId })
        shop.items = shop.items.filter(i => i !== item._id)
        await shop.save()
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        return res.status(200).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `delete item error ${error}` })
    }
}

export const getItemByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ message: "city is required" })
        }
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')
        if (!shops) {
            return res.status(400).json({ message: "shops not found" })
        }
        const shopIds=shops.map((shop)=>shop._id)

        const items=await Item.find({shop:{$in:shopIds}})
        return res.status(200).json(items)

    } catch (error) {
 return res.status(500).json({ message: `get item by city error ${error}` })
    }
}

export const getItemsByShop=async (req,res) => {
    try {
        const {shopId}=req.params
        const shop=await Shop.findById(shopId).populate("items")
        if(!shop){
            return res.status(400).json("shop not found")
        }
        return res.status(200).json({
            shop,items:shop.items
        })
    } catch (error) {
         return res.status(500).json({ message: `get item by shop error ${error}` })
    }
}

export const searchItems=async (req,res) => {
    try {
        const {query,city}=req.query
        if(!query || !city){
            return null
        }
        const shops=await Shop.find({
            city:{$regex:new RegExp(`^${city}$`, "i")}
        }).populate('items')
        if(!shops){
            return res.status(400).json({message:"shops not found"})
        }
        const shopIds=shops.map(s=>s._id)
        const items=await Item.find({
            shop:{$in:shopIds},
            $or:[
              {name:{$regex:query,$options:"i"}},
              {category:{$regex:query,$options:"i"}}  
            ]

        }).populate("shop","name image")

        return res.status(200).json(items)

    } catch (error) {
         return res.status(500).json({ message: `search item  error ${error}` })
    }
}


export const rating=async (req,res) => {
    try {
        const {itemId,rating}=req.body

        if(!itemId || !rating){
            return res.status(400).json({message:"itemId and rating is required"})
        }

        if(rating<1 || rating>5){
             return res.status(400).json({message:"rating must be between 1 to 5"})
        }

        const item=await Item.findById(itemId)
        if(!item){
              return res.status(400).json({message:"item not found"})
        }

        const newCount=item.rating.count + 1
        const newAverage=(item.rating.average*item.rating.count + rating)/newCount

        item.rating.count=newCount
        item.rating.average=newAverage
        await item.save()
return res.status(200).json({rating:item.rating})

    } catch (error) {
         return res.status(500).json({ message: `rating error ${error}` })
    }
}