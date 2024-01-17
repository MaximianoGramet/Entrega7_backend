import { postModel } from "../../models/product.model.js";

class ProductDao {
  async findProduct() {
    try {
      return await postModel.find();
    } catch (error) {
      throw new Error(`Error while finding products: ${error.message}`);
    }
  }

  async createProduct(post) {
    try {
      return await postModel.create(post);
    } catch (error) {
      throw new Error(`Error while creating product: ${error.message}`);
    }
  }

  async updateProduct(_id, post) {
    try {
      return await postModel.findOneAndUpdate({ _id }, post);
    } catch (error) {
      throw new Error(`Error while updating product: ${error.message}`);
    }
  }

  async deleteProduct(_id) {
    try {
      return await postModel.findByIdAndDelete({ _id });
    } catch (error) {
      throw new Error(`Error while deleting product: ${error.message}`);
    }
  }

  async getProductById(_id) {
    try {
      return await postModel.findById(_id);
    } catch (error) {
      throw new Error(`Error while getting product by ID: ${error.message}`);
    }
  }
}

export default new ProductDao();
