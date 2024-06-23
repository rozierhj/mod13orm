const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try{
    const tag = await Tag.findAll({
      include:[{model:Product}],
    });
    res.status(200).json(tag);
  }catch(err){
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{

    const tagID = await Tag.findByPk(req.params.id,{
      include:[{model:Product}],
    });
    if(!tagID){
      res.status(404).json({message:"Could not find tag"});
      return;
    }
    res.status(200).json(tagID);

  }catch(err){
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });

    if(req.body.product_id){
      // await ProductTag.create({
      //   tag_id:newTag.id,
      //   product_id:req.body.product_id,
      const allProducts = req.body.product_id.map((products)=>{
        return ProductTag.create({
          tag_id:newTag.id,
          product_id: products,
        });
      });

      await Promise.all(allProducts);
      //});
    }
    res.status(200).json(newTag);
  }catch(err){
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const tag = await Tag.update(
      {tag_name:req.body.tag_name},
      {where: {id: req.params.id}}
    );
    if(!tag){
      res.status(404).json({message:'no tag found'});
      return;
    }
    res.status(200).json({message:'you updated the tag'});

  }catch(err){
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{

    const tag = await Tag.destroy({
      where:{
        id:req.params.id,
      },
    });
    if(!tag){
      res.status(404).json({message:'could not find tag'});
      return;
    }
    res.status(200).json(tag);

  }catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
