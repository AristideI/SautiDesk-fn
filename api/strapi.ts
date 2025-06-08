import axios from "axios";

import { apiUrl } from "../utils/env";

const strapi = axios.create({
  baseURL: `${apiUrl}/api`,
});

export default strapi;
