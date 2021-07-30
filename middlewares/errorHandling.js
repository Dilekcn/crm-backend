const errorHandling = (err, req, res, next) => {
    res.status(err.status || 500);

	if (err.message.name !== undefined && err.message.name === 'ValidationError') {
		const keys = Object.keys(err.message.errors);
		res.json({status: err.status, message:keys.map((key) => err.message.errors[key].message + ' ').join('')});
	}

    if(err.message.kind && err.message.kind === 'ObjectId') {
        const keys = Object.keys(err.message.value)
        res.json({status:404, message: `This Id (${err.message.value[keys[0]]}) is not exist in path ${keys[0]}`})
    }

    if(err.message.code == '11000') {
        const keys = Object.keys(err.message)
        if(keys.includes('keyValue')) {
            const key = Object.keys(err.message.keyValue)
            res.json({status:400, message: `'${err.message.keyValue[key[0]]}' is already exist. The path '${key[0]}' must be unique.`})
        }
    }

	res.json({status:err.status, message:err.message});
}

module.exports = errorHandling