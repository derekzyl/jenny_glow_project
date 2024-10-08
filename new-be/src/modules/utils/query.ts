
export class Queries {
  model: any;
  request_query: any;
  constructor(model: any, request_query: any) {
    this.model = model;
    this.request_query = request_query;
  }

  filter() {
    const queryObj = { ...this.request_query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.model = this.model.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.request_query.sort) {
      const sort = this.request_query.sort.split(",").join(" ");
      this.model = this.model.sort(sort);
    } else {
      this.model = this.model.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.request_query.fields) {
      const fields = this.request_query.fields.split(",").join(" ");
      this.model = this.model.select(fields);
    } else {
      this.model = this.model.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.request_query.page * 1 || 1;
    const limit = this.request_query.limit * 1 || 50;
    const skip = (page - 1) * limit;

    this.model = this.model.skip(skip).limit(limit);

    return this;
  }
}
