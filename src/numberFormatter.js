const numberWithCommas = (number) => {
    // Function for adding commas into a number
    let parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export {
    numberWithCommas
}