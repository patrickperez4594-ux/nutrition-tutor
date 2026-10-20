import { t } from '../i18n';

const QUICK_TOPICS = ['protein', 'fiber', 'labels', 'calories', 'budget'];

// Quick Learn routes through the existing tutor. Courses, quizzes, and Calorie Lab arrive in later plans.
export default function LearnScreen({ lowEnergy, onAsk }) {
  const topics = lowEnergy ? QUICK_TOPICS.slice(0, 3) : QUICK_TOPICS;
  return (
    <section className="kefi-screen" aria-labelledby="learn-title">
      <h1 id="learn-title" tabIndex={-1}>{t('learn.title')}</h1>
      <h2 className="section-heading">{t('learn.quickLearn')}</h2>
      {!lowEnergy && <p className="muted">{t('learn.quickHint')}</p>}
      <div className="topic-list">
        {topics.map((topic) => {
          const label = t(`learn.topic.${topic}`);
          return (
            <button key={topic} type="button" className="topic-button" onClick={() => onAsk(t('starter.learnTopic', { topic: label.toLowerCase() }))}>
              {label}
            </button>
          );
        })}
      </div>
      <h2 className="section-heading">{t('learn.coursesHeading')}</h2>
      <p className="muted">{t('learn.coursesUnavailable')}</p>
    </section>
  );
}
