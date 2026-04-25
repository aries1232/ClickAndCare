import multer from 'multer'

const MAX_FILE_BYTES = 500 * 1024 // 500 KB

const storage = multer.diskStorage({
    filename: function (req, file, fun) {
        fun(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false)
    }
    cb(null, true)
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_BYTES, files: 1 },
})

export default upload
