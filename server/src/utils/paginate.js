export const paginate = async (
  findManyFn,
  countFn,
  { page = 1, pageSize = 10, ...props }
) => {
  const skip = (parseInt(page) - 1) * parseInt(pageSize);

  const [data, total] = await Promise.all([
    findManyFn({
      ...props,
      skip,
      take: parseInt(pageSize),
    }),
    countFn(props.where || {}),
  ]);

  const totalPages = Math.ceil(total / parseInt(pageSize));

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
    },
  };
};
