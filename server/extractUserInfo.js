function extractUserInfo(message) {
  let height = 0;
  let skinTone = "";
  let occasion = "";

  const heightMatch = message.match(/\d+/);

  if (heightMatch) {
    height = Number(heightMatch[0]);
  }

  if (message.includes("medium")) {
    skinTone = "medium";
  } else if (message.includes("fair")) {
    skinTone = "fair";
  }

  if (message.includes("party")) {
    occasion = "party";
  } else if (message.includes("college")) {
    occasion = "college";
  } else if (message.includes("office")) {
    occasion = "office";
  }

  return {
    height,
    skinTone,
    occasion,
  };
}

module.exports = extractUserInfo;