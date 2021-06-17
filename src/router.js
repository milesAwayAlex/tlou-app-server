import express from 'express';
import Chapter from '../models/chapter.js';
import Section from '../models/section.js';
import Type from '../models/type.js';
import Article from '../models/art.js';
const router = express.Router();

// middleware to parse JSON
router.use(express.json());

// request to select the items
router.post('/select', async (req, res, next) => {
  try {
    // retrieve the types and chapters from the db
    const types = Type.find({ game: req.body.game }).sort('name').lean();
    const chapters = Chapter.find(
      { game: req.body.game },
      'number name sections'
    )
      .populate({ path: 'sections', sort: { number: 1 }, lean: true })
      .sort('number')
      .lean();
    const results = await Promise.all([types, chapters]);
    // assemble JSON payload
    const data = {
      chapters: [].concat(results[1]),
      types: [].concat(results[0]),
    };
    // send the response as JSON
    res.json(data);
  } catch (err) {
    console.error(err);
  }
});

// request to display the selected items
router.post('/display', async (req, res, next) => {
  try {
    // retrieve the selected sections with all associated items
    const sectionsQuery = req.body.sections.map(section =>
      Section.findById(section)
        .populate({ path: 'articles', sort: { number: 1 }, lean: true })
        .lean()
    );
    const sections = await Promise.all(sectionsQuery);
    // TODO REFACTOR
    for await (const section of sections) {
      // get the chapter name for each section
      const chapter = await Chapter.findOne(
        { sections: section._id },
        'name'
      ).lean();
      // assign the chapter name
      section.chapter = chapter.name;
      // filter the items by types in the request (IDs are used)
      section.articles = section.articles.filter(article => {
        return req.body.types.includes(article.type.toString());
      });
      // get the type names
      // queries run in parallel
      const types = section.articles.map(article =>
        Type.findById(article.type).lean()
      );
      const resTypes = await Promise.all(types);
      // assign the type name to each item
      section.articles.forEach(
        (article, index) => (article.type = resTypes[index].name)
      );
    }
    sections.sort((a, b) => {
      return a.number - b.number;
    });
    // the end of REFACTOR
    // send the payload (array of sections with items)
    res.json(sections);
  } catch (e) {
    console.error(e);
  }
});

// request to get the id for the next section
router.post('/next', async (req, res, next) => {
  try {
    // check the number of the section
    const secNumber = req.body.number || 0;
    // retrieve the section with the ++number
    let nextSectionId = await Section.findOne(
      { number: secNumber + 1 },
      '_id'
    ).lean();
    // if no section found - return the first one
    if (!nextSectionId) {
      nextSectionId = await Section.findOne({ number: 1 }, '_id').lean();
    }
    res.json(nextSectionId);
  } catch (e) {
    console.error(e);
  }
});

// this will work differently with multiple games
router.all('/games', async (req, res, next) => {
  try {
    // retrieve the 'game' field of all chapters
    const games = await Chapter.find({}, 'game').lean();
    // assemble the game list
    const data = [];
    games.forEach(e => {
      if (!data.includes(e.game)) data.push(e.game);
    });
    res.json(data);
  } catch (e) {
    console.error(e);
  }
});

export default router;
