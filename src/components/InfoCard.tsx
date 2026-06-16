import React from 'react';

interface InfoCardData {
  name: string;
  description?: string;
  bodySize?: string;
  habitat?: string;
  diet?: string;
  behavior?: string;
  protectionLevel?: string;
}

interface InfoCardProps {
  data: InfoCardData;
  onClose: () => void;
}

const getTagClass = (level?: string): string => {
  if (!level) return '';
  if (level === '无危') return 'card-tag tag-safe';
  if (level === '近危') return 'card-tag tag-safe';
  if (level === '易危') return 'card-tag tag-vulnerable';
  if (level === '濒危') return 'card-tag tag-endangered';
  if (level === '极危') return 'card-tag tag-critical';
  return 'card-tag tag-safe';
};

const InfoCard: React.FC<InfoCardProps> = ({ data, onClose }) => {
  return (
    <div className="info-card-overlay" onClick={onClose}>
      <div className="info-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-name">{data.name}</div>
          <button className="card-close" onClick={onClose}>
            X
          </button>
        </div>
        <div className="card-body">
          {data.description && (
            <div className="card-row">
              <div className="card-label">介绍</div>
              <div className="card-value">{data.description}</div>
            </div>
          )}
          {data.bodySize && (
            <div className="card-row">
              <div className="card-label">体型</div>
              <div className="card-value">{data.bodySize}</div>
            </div>
          )}
          {data.habitat && (
            <div className="card-row">
              <div className="card-label">栖息地</div>
              <div className="card-value">{data.habitat}</div>
            </div>
          )}
          {data.diet && (
            <div className="card-row">
              <div className="card-label">饮食</div>
              <div className="card-value">{data.diet}</div>
            </div>
          )}
          {data.behavior && (
            <div className="card-row">
              <div className="card-label">习性</div>
              <div className="card-value">{data.behavior}</div>
            </div>
          )}
          {data.protectionLevel && (
            <div className="card-row">
              <div className="card-label">保护等级</div>
              <div className="card-value">
                <span className={getTagClass(data.protectionLevel)}>
                  {data.protectionLevel}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
