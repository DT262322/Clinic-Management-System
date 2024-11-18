import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ArticleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/Articles/detail/${id}`);
        if (res.data) {
          setArticle(res.data);
        } else {
          setError("Article not found");
        }
      } catch (error) {
        console.error('Error:', error); 
        setError("Error fetching article details");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);


  const splitSummaryIntoSections = (summary) => {
    const sentences = summary.split('. ').map(s => s + '.');
    const firstSection = sentences.slice(0, 2).join(' ');
    const remainingSections = [];

    for (let i = 2; i < sentences.length; i += 5) {
      remainingSections.push(sentences.slice(i, i + 5).join(' '));
    }

    return { firstSection, remainingSections };
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return <div>Article not found</div>;

  const { firstSection, remainingSections } = splitSummaryIntoSections(article.summary);

  return (
    <div className="article-detail-container">
      <div className="article-header">
        <div className="updated-date">
          UpdatedDate: {new Date(article.UpdatedDate).toLocaleDateString()}
        </div>
      </div>
      
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>

      <h1 className="article-detail-title">{article.title}</h1>

      <div className="article-detail-content slide-in">
        <p>{article.content}</p>
      </div>

      <div className="article-detail-summary fade-in">
        <div className="article-section">
          <p><strong>{firstSection}</strong></p>
          <img alt="Section illustration" src={`/path/to/image-0.jpg`} className="section-image" />
        </div>

        {remainingSections.map((section, index) => (
          <div key={index + 1} className="article-section">
            <p>{section}</p>
            <img alt="Section illustration" src={`/path/to/image-${index + 1}.jpg`} className="section-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleDetail;
