import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ResponseReviewDto } from './dto/response-review.dto';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>
  ) { }

  async create(createReviewDto: CreateReviewDto): Promise<ResponseReviewDto> {
    try {

      let comment = this.reviewRepository.create({
        student: { id: createReviewDto.id_user },
        room: { id: createReviewDto.id_room },
        comment: createReviewDto.comment,
        calif: createReviewDto.calif
      })

      comment = await this.reviewRepository.save(comment);
      const savedReview = await this.findOne(comment.id)
      if (!savedReview) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
      }

      return this.toResponseReviewDto(savedReview)

    } catch (error) {

      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        'Failed to create comment',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findAll(id_room: string): Promise<ResponseReviewDto[]> {
    try {
      
      const listComments = await this.reviewRepository.find({
        where: {
          room: {
            id: id_room
          }
        },
        relations: {
          student: true
        }
      });

      return listComments.map((comment) => this.toResponseReviewDto(comment));

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to list comments',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  async findOne(id: string): Promise<Review | null> {
    return await this.reviewRepository.findOne({
      where: { id },
      relations: ['student']
    })

  }


  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {

    try {
      const review = await this.reviewRepository.findOneBy({ id });

      if (!review) {
        throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
      }

      await this.reviewRepository.update(id, updateReviewDto);
      const updatedReview = await this.reviewRepository.findOneBy({ id });

      return updatedReview!;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to update review', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async remove(id: string): Promise<{ message: string }> {
    try {
      const review = await this.reviewRepository.findOneBy({ id });

      if (!review) {
        throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
      }

      await this.reviewRepository.delete(id);

      return { message: 'Review deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Failed to delete review', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  private toResponseReviewDto(review: Review): ResponseReviewDto {
    return {
      user: {
        id: review.id,
        name: review.student.name + review.student.lastName,
        image: review.student.image
      },
      comment: review.comment,
      qualification: review.calif
    }
  }

}
