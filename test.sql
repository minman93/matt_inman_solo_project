\c nc_news_test

SELECT 
    A.author, 
    A.title, 
    A.article_id,
    A.body, 
    A.topic, 
    A.created_at, 
    A.votes, 
    A.article_img_url 
    FROM articles A
    WHERE article_id = 3;