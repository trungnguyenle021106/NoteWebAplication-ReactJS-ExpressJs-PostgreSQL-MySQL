class BaseRepository {

  constructor(context) {
    if (!context) {
      throw new Error("Context for database is required.");
    }
    this.context = context
  }

  async create(data) {
    throw new Error('Phương thức "create" chưa được triển khai.');
  }

  async readAll() {
    throw new Error('Phương thức "readAll" chưa được triển khai.');
  }

  async readById(id) {
    throw new Error('Phương thức "readById" chưa được triển khai.');
  }

  async update(id, data) {
    throw new Error('Phương thức "update" chưa được triển khai.');
  }


  async delete(id) {
    throw new Error('Phương thức "delete" chưa được triển khai.');
  }
}

module.exports = BaseRepository;
