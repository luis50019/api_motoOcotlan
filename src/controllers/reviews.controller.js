import ErrorInfo from "../errors/errorInfo.js";
import ReviewsService from "../services/reviews.services.js";
import validateReviews from "../schemas/reviews.schema.js";
class ReviewsController{

  static async register(req,res){
    try {
      const isValid = validateReviews(req.body);
      if(!isValid.success){
        throw new ErrorInfo("Validation Error",400,isValid.error.issues);
      }

      const result = await ReviewsService.registerReview(req.body);
      if(!result.status){
        throw new Error("No se logro registrar el comentario");
      }
      res.status(201).json({data:result,message:"Comentario registrado"});
    } catch (error) {
      if(error instanceof ErrorInfo){
        res.status(error.code).json({error:error.message});
      }else{
        res.status(500).json({error:error.message});
      }
    }

  }

  static async ReviewsDrivers(req,res){
    try {
      const { id } = req.params;
      console.log(id)
      const result = await ReviewsService.getReviews(id);
      if(result.legth == 0){
        throw new Error("Error");
      }
      res.status(200).json({data:result,message:"Comentarios obtenidos"});
    } catch (error) {
      if(error instanceof ErrorInfo){
        res.status(error.code).json({error:error.message});
      }else{
        res.status(500).json({error:"Error interno del servidor"});
      }
    }
  }

}

export default ReviewsController;