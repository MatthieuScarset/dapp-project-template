const settings = fetch("/env.json").then((response) => response.json());

export default await settings;
