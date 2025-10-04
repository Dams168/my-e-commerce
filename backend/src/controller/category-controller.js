import categoryService from '../service/category-service.js';

const getAllCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCategories,
};
