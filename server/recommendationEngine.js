function getRecommendation(height, skinTone, occasion) {
 if (occasion === "party") {

  if (height >= 170 && skinTone === "medium") {
    return "Navy blazer with beige chinos.";
  }

  if (height >= 170 && skinTone === "fair") {
    return "Black blazer with grey trousers.";
  }

  if (height < 170 && skinTone === "medium") {
    return "Slim-fit navy shirt with dark trousers.";
  }

  return "Dark green blazer with black jeans.";
}

  if (occasion === "college") {
    return "Oversized hoodie with relaxed-fit jeans.";
  }

  if (occasion === "office") {
    return "Formal shirt with tailored trousers.";
  }

  return "Casual t-shirt with straight-fit jeans.";
}
module.exports = getRecommendation;