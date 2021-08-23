exports.existsInDatabase = async (id, mongooseModel) => {
    return !!(await mongooseModel.findById(id));
};

exports.validateImage = (image) => {
    if (image) {
        if (!image.size > 0) {
            return {
                error: "Se recibió una imagen nula",
            };
        }
        if (image.size > 1000000) {
            return {
                error: "La imagen es demasiado pesada",
            };
        }
    }
    return null;
};
