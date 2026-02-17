const { where } = require("sequelize");
const PlatformModel = require("../models/platform");


const PlatformController = () => {

    /**
 * @description Get all active platforms
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns List of platforms (id, name, icon, is_active)
 */


    const getAllPlatforms = async (req, res) => {
        try {

            const platforms = await PlatformModel.findAll({
                order: [["id", "DESC"]],
            });

            return res.status(200).json({
                success: true,
                data: platforms,
            });

        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    };


    const addPlatform = async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Platform name is required",
                })
            }

            const existingPlatform = await PlatformModel.findOne({
                where: { name },
            });

            if (existingPlatform) {
                return res.status(400).json({
                    success: false,
                    message: "Platform Already Exist",
                });
            }

            const platform = await PlatformModel.create({
                name,
            });

            return res.status(200).json({
                success: true,
                message: "Platform created successfully",
            });

        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    };


    const updatePlatform = async (req, res) => {
        try {
            const { id, name } = req.body;


            if (!id || !name) {
                return res.status(400).json({
                    success: false,
                    message: "Id and name are required",
                });
            }

            const platform = await PlatformModel.findByPk(id);

            if (!platform) {
                return res.status(400).json({
                    success: false,
                    message: "Platform Not Found"
                });
            }

            const existingPlatform = await PlatformModel.findOne({
                where: { name },
            });

            if (existingPlatform && existingPlatform.id != id) {
                return res.status(400).json({
                    success: false,
                    message: "Platform Name Already Exists"
                });
            }

            await platform.update({
                name,
            })
            return res.status(200).json({
                success: true,
                message: "Platform Updated succefully",
                data: platform
            });
        }

        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            })

        }
    }


    const deletePlatform = async (req, res) => {

        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Platform id is Required"
                });
            }
            const platform = await PlatformModel.findByPk(id);

            if (!platform) {
                return res.status(400).json({
                    success: false,
                    message: "Platform not Found"
                });
            }

            await platform.destroy();

            return res.status(200).json({
                success: true,
                message: " Platform Deleted Successfully"
            });

        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    const getPlatformById = async (req, res) => {
        try {

            const { id } = req.query;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Platform id is required",
                });
            }

            const platform = await PlatformModel.findByPk(id);

            if (!platform) {
                return res.status(404).json({
                    success: false,
                    message: "Platform not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: platform,
            });

        }
         catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };


    return {
        getAllPlatforms, addPlatform, updatePlatform, deletePlatform, getPlatformById
    };
}

module.exports = PlatformController;