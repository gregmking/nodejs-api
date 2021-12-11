const advancedResults = (model, populate) => async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Initalize query
  let query = model.find(reqQuery);

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate
  if(populate) {
      query = query.populate(populate);
  }

  // Execute query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
  }

  next();
};

module.exports = advancedResults;
