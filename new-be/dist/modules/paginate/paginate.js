const paginate = (schema) => {
    /**
     * @typedef {Object} QueryResult
     * @property {Document[]} results - Results found
     * @property {number} page - Current page
     * @property {number} limit - Maximum number of results per page
     * @property {number} totalPages - Total number of pages
     * @property {number} totalResults - Total number of documents
     */
    /**
     * Query for documents with pagination
     * @param {Object} [filter] - Mongo filter
     * @param {Object} [options] - Query options
     * @param {string} [options.sort] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
     * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @param {string} [options.projectBy] - Fields to hide or include (default = '')
     * @returns {Promise<QueryResult>}
     */
    schema.static('paginate', async function (filter, options) {
        let sort = '';
        if (options.sort) {
            const sortingCriteria = [];
            options.sort.split(',').forEach((sortOption) => {
                const [key, order] = sortOption.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        }
        else {
            sort = 'createdAt';
        }
        let project = '';
        if (options.projectBy) {
            const projectionCriteria = [];
            options.projectBy.split(',').forEach((projectOption) => {
                const [key, include] = projectOption.split(':');
                projectionCriteria.push((include === 'hide' ? '-' : '') + key);
            });
            project = projectionCriteria.join(' ');
        }
        else {
            project = 'updatedAt';
        }
        const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
        const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
        const skip = (page - 1) * limit;
        const countPromise = this.countDocuments(filter).exec();
        let queryStr = JSON.stringify(filter);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let docsPromise = this.find(JSON.parse(queryStr)).sort(sort).skip(skip).limit(limit).select(project);
        if (options.populate) {
            options.populate.split(',').forEach((populateOption) => {
                docsPromise = docsPromise.populate(populateOption
                    .split('.')
                    .reverse()
                    .reduce((a, b) => ({ path: b, populate: a })));
            });
        }
        docsPromise = docsPromise.exec();
        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result = {
                results,
                page,
                limit,
                totalPages,
                totalResults,
            };
            return Promise.resolve(result);
        });
    });
};
export default paginate;
//# sourceMappingURL=paginate.js.map