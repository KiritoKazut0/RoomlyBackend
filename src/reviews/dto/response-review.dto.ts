
export class ResponseReviewDto {
    user: {
        id: string,
        name: string
        image?: string
    }
    comment: string
    qualification: number
}