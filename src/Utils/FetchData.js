const fetchData = async (Url, Options = {}) => {
  try {
    const result = await fetch(import.meta.env.VITE_BASE_URL + Url, Options);
    const data = await result.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export default fetchData;
