provider "aws" {
  region = var.aws_region
}

# DynamoDB 테이블
resource "aws_dynamodb_table" "chat_messages" {
  name           = "CultureChat-Messages"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "chatId"
  range_key      = "id"

  attribute {
    name = "chatId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "CultureChat Messages"
  }
}


# S3 버킷 (음성 파일용)
resource "aws_s3_bucket" "transcribe_bucket" {
  bucket = "culturechat-transcribe-bucket"
}

# IAM 역할 (Lambda용)
resource "aws_iam_role" "lambda_role" {
  name = "culturechat-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}
