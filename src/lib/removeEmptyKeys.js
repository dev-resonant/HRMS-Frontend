export const removeEmptyKeys = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      // truthy values pass
      if (v) return true;

      // falsy values allowed only if false or 0
      if (v === false || v === 0) return true;

      return false;
    }),
  );
