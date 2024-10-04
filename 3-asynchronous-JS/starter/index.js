const fs = require("fs");
const superAgent = require("superagent");

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) reject("Could not find the file");
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write to file");
      resolve("Success");
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Promise = superAgent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Promise = superAgent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Promise = await superAgent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const allResolved = await Promise.all([
      res1Promise,
      res2Promise,
      res3Promise,
    ]);

    const images = allResolved.map((el) => el.body.message);

    console.log(images);

    await writeFilePromise(`${__dirname}/dog-image.txt`, images.join("\n"));
    console.log("Random dog image is saved to file");
  } catch (err) {
    console.log(err);

    throw error;
  }

  return "2: Ready";
};

(async () => {
  try {
    console.log("1: will get dog pics");
    const x = await getDogPic();
    console.log(x);
    console.log("3: done getting dog pics");
  } catch (err) {
    console.log("ERROR");
  }
})();

/*
console.log("1: will get dog pics");
getDogPic().then((x) => {
  console.log(x);
  console.log("3: done getting dog pics");
});
*/

/*
readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    // now we are returning a promise and hence once again "then" can be chained after this "then"
    return superAgent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);

    //here again writeFilePromise returns a promise object and we are directly returning the promise object.
    //hence technically this "then" also returns a promise and can be chained again.
    return writeFilePromise(`${__dirname}/dog-image.txt`, res.body.message);
  })
  .then(() => {
    console.log("Random dog image is saved to file");
  })
  .catch((err) => {
    // For all the then only catch is sufficient, if error occurs in any of "then" method control comes to this catch block
    console.log(err);
  });
  */
