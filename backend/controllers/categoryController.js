const Category = require("../models/Category");


// ======================================
// GET ALL CATEGORIES
// ======================================

const getCategories = async (req, res) => {

    try {

        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {

        console.error(
            "Get categories error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories."
        });

    }

};


// ======================================
// ADD CATEGORY
// ======================================

const addCategory = async (req, res) => {

    try {

        const {
            name,
            description
        } = req.body;


        // Validate category name

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Category name is required."
            });

        }


        // Check duplicate category

        const existingCategory =
            await Category.findOne({

                name: {
                    $regex: new RegExp(
                        "^" + name.trim() + "$",
                        "i"
                    )
                }

            });


        if (existingCategory) {

            return res.status(400).json({
                success: false,
                message: "Category already exists."
            });

        }


        // ======================================
        // CATEGORY IMAGE
        // ======================================

        let image = "";

        if (req.file) {

            image =
                "/uploads/categories/" +
                req.file.filename;

        }


        // ======================================
        // CREATE CATEGORY
        // ======================================

        const category =
            await Category.create({

                name:
                    name.trim(),

                description:
                    description
                        ? description.trim()
                        : "",

                image:
                    image

            });


        res.status(201).json({

            success: true,

            message:
                "Category added successfully.",

            category

        });

    } catch (error) {

        console.error(
            "Add category error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to add category."

        });

    }

};


// ======================================
// UPDATE CATEGORY
// ======================================

const updateCategory = async (req, res) => {

    try {

        const { id } =
            req.params;

        const {
            name,
            description
        } = req.body;


        // Validate name

        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Category name is required."

            });

        }


        // Find category

        const category =
            await Category.findById(id);


        if (!category) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found."

            });

        }


        // Check duplicate name

        const duplicateCategory =
            await Category.findOne({

                name: {
                    $regex: new RegExp(
                        "^" + name.trim() + "$",
                        "i"
                    )
                },

                _id: {
                    $ne: id
                }

            });


        if (duplicateCategory) {

            return res.status(400).json({

                success: false,

                message:
                    "Another category already has this name."

            });

        }


        // ======================================
        // UPDATE BASIC DETAILS
        // ======================================

        category.name =
            name.trim();

        category.description =
            description
                ? description.trim()
                : "";


        // ======================================
        // UPDATE IMAGE IF NEW IMAGE PROVIDED
        // ======================================

        if (req.file) {

            category.image =
                "/uploads/categories/" +
                req.file.filename;

        }


        await category.save();


        res.status(200).json({

            success: true,

            message:
                "Category updated successfully.",

            category

        });

    } catch (error) {

        console.error(
            "Update category error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to update category."

        });

    }

};


// ======================================
// DELETE CATEGORY
// ======================================

const deleteCategory = async (req, res) => {

    try {

        const { id } =
            req.params;


        const category =
            await Category.findById(id);


        if (!category) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found."

            });

        }


        await Category.findByIdAndDelete(id);


        res.status(200).json({

            success: true,

            message:
                "Category deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete category error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to delete category."

        });

    }

};


module.exports = {

    getCategories,
    addCategory,
    updateCategory,
    deleteCategory

};