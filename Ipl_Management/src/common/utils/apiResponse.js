class apiResponse {

    // =========================================================
    // 200 OK
    // Use:
    // - GET success
    // - Update success
    // - General success
    // =========================================================
    static ok(res, message, data = null){
        return res.status(200).json({
            success: true,
            message,
            data
        })
    }


    // =========================================================
    // 201 CREATED
    // Use:
    // - New resource created
    // - Registration
    // - Insert operations
    // =========================================================
    static created(res, message, data = null){
        return res.status(201).json({
            success: true,
            message,
            data
        })
    } 


    // =========================================================
    // 202 ACCEPTED
    // Use:
    // - Background jobs
    // - Queue processing
    // =========================================================
    static accepted(res, message, data = null){
        return res.status(202).json({
            success: true,
            message,
            data
        })
    }


    // =========================================================
    // 204 NO CONTENT
    // Use:
    // - Delete success
    // - No response body needed
    // =========================================================
    static noContent(res){
        return res.status(204).send()
    }


    // =========================================================
    // 206 PARTIAL CONTENT
    // Use:
    // - Partial data
    // - File streaming
    // =========================================================
    static partialContent(res, message, data = null){
        return res.status(206).json({
            success: true,
            message,
            data
        })
    }


    // =========================================================
    // 207 MULTI STATUS
    // Use:
    // - Bulk operations
    // - Batch processing
    // =========================================================
    static multiStatus(res, message, data = null){
        return res.status(207).json({
            success: true,
            message,
            data
        })
    }


    // =========================================================
    // Custom Success Response
    // Use:
    // - Custom status codes
    // =========================================================
    static custom(res, statusCode, message, data = null){
        return res.status(statusCode).json({
            success: true,
            message,
            data
        })
    }

}

export default apiResponse