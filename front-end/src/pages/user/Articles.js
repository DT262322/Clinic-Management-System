import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import '../css/Articles.css';
import { useNavigate } from 'react-router-dom';
import ArticleService from '../../service/ArticleService';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [expandedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await ArticleService.getAllArticles();
        if (Array.isArray(res.data)) {
          setArticles(res.data);
        } else {
          setError("Data format is incorrect");
        }
      } catch (error) {
        setError("Error fetching articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);


  const openArticlePage = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="articles-container">
      <h1 className="articles-title fade-in">SỨC KHỎE LÀ VÀNG BẠC</h1>

      {articles.length > 0 && (
        <div className="featured-article slide-in">
          <Card
            title={articles[0].title}
            header={<img alt={articles[0].title} src={`https://project-sem3-2024.s3.ap-southeast-1.amazonaws.com/${articles[0].imageName}`} className="featured-image" />}
            className="article-card featured-card"
          >
            <p>{articles[0].summary}</p>
          </Card>
        </div>
      )}

      <div className="articles-grid">
        {articles.slice(1).map((article, index) => (
          <Card
          key={article.id}
          title={article.title}
            header={<img alt={article.title}
              src={`https://project-sem3-2024.s3.ap-southeast-1.amazonaws.com/${article.imageName}`}
              className="article-image" />}
          className="article-card slide-in"
          onClick={() => openArticlePage(article.id)}
        >
          <p>
            {expandedArticle === index ? article.content : article.content.substring(0, 150)}...
          </p>
        </Card>
        
        ))}
      </div>
    </div>
  );
};

export default Articles;
