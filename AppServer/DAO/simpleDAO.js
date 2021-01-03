class simpleDAO {

    static async findById(id, Model) {
        console.log("Inside findById with id", id, "Model:", Model);
        return await Model.findById(id).exec();
    };

    static async findOne(filter, Model) {
        console.log("Inside findOne with filter", filter, "Model:", Model);
        return await Model.findOne(filter).exec();
    }

    static async findOneAndDelete(filter, Model) {
        console.log("Inside findOneAndDelete with filter", filter, "Model:", Model);
        const record = await this.findOne(filter, Model);
        console.log("record", record);
        await this.delete(record._id, Model);
        return record;
        // return await Model.findOneAndDelete(filter).exec();
    }

    static async save(record, Model) {
        console.log("Inside save with record", record, "Model:", Model);
        const newEntry = new Model(record);
        console.log("newEntry", newEntry);
        await newEntry.save();
    }

    static async delete(id, Model) {
        console.log("Inside delete with id", id, "Model:", Model);
        return await Model.findByIdAndRemove(id).exec();
    }
}

module.exports = simpleDAO;