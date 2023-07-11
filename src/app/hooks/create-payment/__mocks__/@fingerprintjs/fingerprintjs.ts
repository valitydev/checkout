module.exports = {
    load: jest.fn().mockReturnValue(
        Promise.resolve({
            get: jest.fn().mockReturnValue(
                Promise.resolve({
                    visitorId: 'userFingerprintTest'
                })
            )
        })
    )
};
