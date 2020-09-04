const Category = require('../models/category')

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id, (err, category) => {
        if(err) {
            return res.status(400).json({err: 'Unable to find category'});
        }
        req.category = category;
        next();
    });
}

exports.createCategory = (req, res) => {
    new Category(req.body).save((err, category) => {
        if(err) {
            return res.status(400).json({err});
        }
        return res.status(200).json(category);
    });
}

exports.getCategory = (req, res) => {
    return res.status(200).json(req.category);
}

exports.getAllCategory = (req, res) => {
    Category.find((err, catregories) => {
        if(err || !catregories.length) {
            return res.status(400).json({ err: 'No categories found' });
        }
        return res.status(200).json(catregories);
    });
}

exports.updateCategory = (req, res) => {
    Category.findByIdAndUpdate({_id: req.category._id}, {$set: req.body}, {new: true}, (err, category) => {
        if(err) {
            return res.status(400).json({ err: 'Unable to update category' });
        }
        return res.status(200).json(category);
    })
}

exports.deleteCategory = (req, res) => {
    const {category} = req;
    category.remove((err, category) => {
        if(err) {
            return res.status(400).json({ err: 'Unable to remove category' });
        }
        return res.status(200).json({ message: `${category.name} category successfully deleted` });
    });
}
