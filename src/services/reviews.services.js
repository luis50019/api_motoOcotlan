import validateReviews from "../schemas/reviews.schema.js";
import ErrorInfo from "../erros/errorInfo.js";
import reviews from "../model/coment.model.js";
import drivers from "../model/drivers.model.js"

class ReviewsService {
  static async calculateDriverRating(driverId) {
    try {
      // Obtener todas las reviews del conductor
      const driverReviews = await reviews.find({
        "participants.driver_id": driverId,
      });

      if (driverReviews.length === 0) {
        return {
          status:false,
          overall: 0,
          punctuality: 0,
          vehicle: 0,
          driving: 0,
          totalReviews: 0,
        };
      }

      // Sumar todos los ratings
      let totalOverall = 0;
      let totalPunctuality = 0;
      let totalVehicle = 0;
      let totalDriving = 0;

      driverReviews.forEach((review) => {
        totalOverall += review.content.rating.overall;
        totalPunctuality += review.content.rating.categories.punctuality;
        totalVehicle += review.content.rating.categories.vehicle;
        totalDriving += review.content.rating.categories.driving;
      });

      // Calcular promedios
      const avgOverall = totalOverall / driverReviews.length;
      const avgPunctuality = totalPunctuality / driverReviews.length;
      const avgVehicle = totalVehicle / driverReviews.length;
      const avgDriving = totalDriving / driverReviews.length;

      return {
        status:true,
        overall: parseFloat(avgOverall.toFixed(1)), // Redondear a 1 decimal
        punctuality: parseFloat(avgPunctuality.toFixed(1)),
        vehicle: parseFloat(avgVehicle.toFixed(1)),
        driving: parseFloat(avgDriving.toFixed(1)),
        totalReviews: driverReviews.length,
      };
    } catch (error) {
      throw new Error("Error calculating driver rating: " + error.message);
    }
  }
  static async registerReview(review) {
    try {
      const isValidateInfo = validateReviews(review);

      if (!isValidateInfo.success) {
        throw new ErrorInfo(
          isValidateInfo.message,
          400,
          isValidateInfo.error.issues
        );
      }
      const newComet = new reviews({
        participants: {
          driver_id: review.idDriver,
          passenger_id: review.idUser,
        },
        content: {
          comment: review.comment,
          rating: {
            overall: review.rating,
            categories: {
              punctuality: review.rating,
              vehicle: review.rating,
              driving: review.rating,
            },
          },
          photos: review.photo ? [review.photo] : [],
        },
      });

      const comentSave = await newComet.save();
      // Calcular el nuevo rating del conductor
      const updatedRating = await ReviewsService.calculateDriverRating(
        review.idDriver
      );
      const updatedDriver = await drivers.findOneAndUpdate(
        { _id: review.idDriver }, // Filtro por ID
        {
          $set: {
            rating: updatedRating.overall, 
          },
        },
        { new: true } // Devuelve el documento actualizado
      );
      return {
        status:true,
        savedReview: comentSave,
        driverRating: updatedRating, // Devuelve el rating actualizado
      };
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(
          error.message,
          error.status,
          error.getErrorsMessages()
        );
      }
      throw new Error(error);
    }
  }
  // get all reviews
  static async getReviews(idDriver) {
    try {
      console.log(idDriver);
      const reviewsDriver = await reviews.find({
        "participants.driver_id": idDriver,
      });
      console.log(reviewsDriver);
      return reviewsDriver;
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(
          error.message,
          error.status,
          error.getErrorsMessages()
        );
      }
      throw new Error(error);
    }
  }
}

export default ReviewsService;
