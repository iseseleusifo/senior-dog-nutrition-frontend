const { useState, useEffect } = React;

// ============================================
// LOCAL STORAGE HELPERS
// ============================================
const Storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  }
};

// Storage keys
const STORAGE_KEYS = {
  PROFILE: 'sdn_profile',
  DAILY_LOGS: 'sdn_daily_logs',
  ROUTINES: 'sdn_routines',
  ONBOARDING_COMPLETE: 'sdn_onboarding_complete'
};

// Get today's date key (YYYY-MM-DD)
const getTodayKey = () => new Date().toISOString().split('T')[0];

// Get or create today's log
const getTodayLog = () => {
  const logs = Storage.get(STORAGE_KEYS.DAILY_LOGS, {});
  const today = getTodayKey();
  if (!logs[today]) {
    logs[today] = { date: today, items: [], totalCalories: 0 };
    Storage.set(STORAGE_KEYS.DAILY_LOGS, logs);
  }
  return logs[today];
};

// ============================================
// SHARED STYLES
// ============================================
const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@400;500;600&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .app-container {
    min-height: 100vh;
    background: #FAF8F3;
    font-family: 'Source Sans 3', -apple-system, sans-serif;
    color: #3D3A36;
    max-width: 430px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
  }
  
  .screen {
    min-height: 100vh;
    background: #FAF8F3;
    padding-bottom: 40px;
  }
  
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    position: relative;
  }
  
  .back-button {
    background: none;
    border: none;
    font-size: 24px;
    color: #3D3A36;
    cursor: pointer;
    padding: 8px;
    margin-left: -8px;
    border-radius: 50%;
    transition: background 0.2s ease;
  }
  
  .back-button:hover {
    background: rgba(0,0,0,0.05);
  }
  
  .top-bar-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 18px;
    font-weight: 500;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 20px;
    color: #7A756E;
    cursor: pointer;
    padding: 8px;
    margin-right: -8px;
  }
  
  .screen-content {
    padding: 12px 24px;
  }
  
  .screen-header {
    margin-bottom: 28px;
  }
  
  .screen-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 26px;
    font-weight: 500;
    color: #2D2A26;
    margin-bottom: 8px;
  }
  
  .screen-subtitle {
    font-size: 15px;
    color: #7A756E;
    line-height: 1.5;
  }
  
  .field-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #9A958E;
    margin-bottom: 10px;
  }
  
  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #9A958E;
    margin-bottom: 14px;
  }
  
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-in {
    animation: fadeUp 0.4s ease forwards;
  }
  
  .delay-1 { animation-delay: 0.05s; opacity: 0; }
  .delay-2 { animation-delay: 0.1s; opacity: 0; }
  .delay-3 { animation-delay: 0.15s; opacity: 0; }
  .delay-4 { animation-delay: 0.2s; opacity: 0; }
  .delay-5 { animation-delay: 0.25s; opacity: 0; }
  
  .primary-button {
    width: 100%;
    padding: 18px;
    font-size: 17px;
    font-family: inherit;
    font-weight: 600;
    border: none;
    border-radius: 14px;
    background: #2D5A3D;
    color: #FFFFFF;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(45, 90, 61, 0.25);
  }
  
  .primary-button:hover {
    background: #245231;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(45, 90, 61, 0.3);
  }
  
  .primary-button:active {
    transform: translateY(0);
  }
  
  .primary-button:disabled {
    background: #B5B0A8;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
  
  .secondary-button {
    padding: 16px 24px;
    font-size: 16px;
    font-family: inherit;
    font-weight: 500;
    border: 2px solid #E8E4DC;
    border-radius: 12px;
    background: #FFFFFF;
    color: #5C5852;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .secondary-button:hover {
    border-color: #B5B0A8;
  }
  
  .text-input {
    width: 100%;
    padding: 14px 16px;
    font-size: 16px;
    font-family: inherit;
    border: 2px solid #E8E4DC;
    border-radius: 12px;
    background: #FFFFFF;
    color: #3D3A36;
    outline: none;
    transition: border-color 0.2s ease;
  }
  
  .text-input:focus {
    border-color: #2D5A3D;
  }
  
  .text-input::placeholder {
    color: #B5B0A8;
  }
`;

// ============================================
// SHARED BOTTOM NAV COMPONENT
// ============================================
const BottomNav = ({ activeTab, onNavigate, onLogItem }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <span className="nav-icon">⌂</span>
        <span className="nav-label">Today</span>
      </button>
      <button 
        className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onNavigate('history')}
      >
        <span className="nav-icon">◷</span>
        <span className="nav-label">History</span>
      </button>
      <button className="log-button" onClick={onLogItem}>
        <span>+</span>
      </button>
      <button 
        className={`nav-item ${activeTab === 'routines' ? 'active' : ''}`}
        onClick={() => onNavigate('routines')}
      >
        <span className="nav-icon">☆</span>
        <span className="nav-label">Routines</span>
      </button>
      <button 
        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onNavigate('settings')}
      >
        <span className="nav-icon">⚙</span>
        <span className="nav-label">Profile</span>
      </button>
      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          background: #FFFFFF;
          border-top: 1px solid #EFEBE4;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding: 12px 16px 28px;
          box-sizing: border-box;
          z-index: 100;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          min-width: 50px;
        }
        .nav-icon {
          font-size: 20px;
          color: #B5B0A8;
          transition: color 0.2s ease;
        }
        .nav-item.active .nav-icon {
          color: #2D5A3D;
        }
        .nav-label {
          font-size: 11px;
          color: #B5B0A8;
          transition: color 0.2s ease;
        }
        .nav-item.active .nav-label {
          color: #2D5A3D;
          font-weight: 500;
        }
        .log-button {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #2D5A3D;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-top: -28px;
          box-shadow: 0 4px 16px rgba(45, 90, 61, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          color: white;
          font-size: 28px;
        }
        .log-button:active {
          transform: scale(0.98);
        }
      `}</style>
    </nav>
  );
};

// ============================================
// WELCOME SCREEN
// ============================================
const WelcomeScreen = ({ onGetStarted }) => {
  return (
    <div className="screen welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon animate-in">
          <svg viewBox="0 0 100 100" width="80" height="80">
            <circle cx="50" cy="50" r="50" fill="#E8E4DC"/>
            <ellipse cx="50" cy="62" rx="28" ry="24" fill="#8B7355"/>
            <circle cx="50" cy="48" r="22" fill="#A08060"/>
            <ellipse cx="38" cy="44" rx="5" ry="6" fill="#3D3A36"/>
            <ellipse cx="62" cy="44" rx="5" ry="6" fill="#3D3A36"/>
            <ellipse cx="50" cy="54" rx="6" ry="5" fill="#3D3A36"/>
            <ellipse cx="26" cy="38" rx="12" ry="16" fill="#8B7355" transform="rotate(-20 26 38)"/>
            <ellipse cx="74" cy="38" rx="12" ry="16" fill="#8B7355" transform="rotate(20 74 38)"/>
            <path d="M44 62 Q50 68 56 62" stroke="#3D3A36" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="welcome-title animate-in delay-1">Senior Dog Nutrition</h1>
        <p className="welcome-subtitle animate-in delay-2">
          Check your dog's daily nutrition and spot likely gaps
        </p>
        
        <div className="welcome-features animate-in delay-3">
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Log meals, treats, and supplements</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>See daily nutrition estimates</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✓</span>
            <span>Get practical fix suggestions</span>
          </div>
        </div>
        
        <button className="primary-button animate-in delay-4" onClick={onGetStarted}>
          Get started
        </button>
      </div>
      
      <style>{`
        .welcome-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
        }
        
        .welcome-content {
          text-align: center;
          max-width: 320px;
        }
        
        .welcome-icon {
          margin-bottom: 24px;
        }
        
        .welcome-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 32px;
          font-weight: 500;
          color: #2D2A26;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        
        .welcome-subtitle {
          font-size: 17px;
          color: #7A756E;
          line-height: 1.5;
          margin-bottom: 40px;
        }
        
        .welcome-features {
          text-align: left;
          margin-bottom: 40px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          font-size: 15px;
          color: #3D3A36;
        }
        
        .feature-icon {
          width: 24px;
          height: 24px;
          background: rgba(45, 90, 61, 0.12);
          color: #2D5A3D;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

// ============================================
// DOG PROFILE SETUP
// ============================================
const ProfileSetupScreen = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    weight: '',
    breed: '',
    activityLevel: 'low',
    neutered: 'yes',
    goalFocus: 'healthy-aging'
  });
  
  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const canProceedStep1 = profile.name && profile.age && profile.weight;
  const canProceedStep2 = true; // Optional fields
  
  if (step === 1) {
    return (
      <div className="screen">
        <div className="top-bar">
          <div style={{ width: 40 }}></div>
          <span className="top-bar-title">About your dog</span>
          <div style={{ width: 40 }}></div>
        </div>
        
        <div className="screen-content">
          <div className="screen-header animate-in">
            <h1 className="screen-title">Let's get started</h1>
            <p className="screen-subtitle">We need a few details to personalize nutrition estimates</p>
          </div>
          
          <div className="form-section animate-in delay-1">
            <label className="field-label">Dog's name</label>
            <input
              type="text"
              className="text-input"
              placeholder="e.g., Bailey"
              value={profile.name}
              onChange={(e) => updateProfile('name', e.target.value)}
            />
          </div>
          
          <div className="form-row animate-in delay-2">
            <div className="form-section half">
              <label className="field-label">Age (years)</label>
              <input
                type="number"
                className="text-input"
                placeholder="e.g., 11"
                value={profile.age}
                onChange={(e) => updateProfile('age', e.target.value)}
              />
            </div>
            
            <div className="form-section half">
              <label className="field-label">Weight (kg)</label>
              <input
                type="number"
                className="text-input"
                placeholder="e.g., 31"
                value={profile.weight}
                onChange={(e) => updateProfile('weight', e.target.value)}
              />
            </div>
          </div>
          
          <div className="step-indicator animate-in delay-3">
            <span className="step-dot active"></span>
            <span className="step-dot"></span>
          </div>
          
          <button 
            className="primary-button animate-in delay-4"
            disabled={!canProceedStep1}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
          
          <p className="skip-text animate-in delay-4">
            These 3 fields are required for calorie estimates
          </p>
        </div>
        
        <style>{profileStyles}</style>
      </div>
    );
  }
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={() => setStep(1)}>←</button>
        <span className="top-bar-title">About {profile.name}</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="screen-header animate-in">
          <h1 className="screen-title">A few more details</h1>
          <p className="screen-subtitle">These help improve accuracy (optional)</p>
        </div>
        
        <div className="form-section animate-in delay-1">
          <label className="field-label">Breed or size</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g., Labrador, Large mix"
            value={profile.breed}
            onChange={(e) => updateProfile('breed', e.target.value)}
          />
        </div>
        
        <div className="form-section animate-in delay-2">
          <label className="field-label">Activity level</label>
          <div className="option-row">
            {['sedentary', 'low', 'moderate', 'active'].map(level => (
              <button
                key={level}
                className={`option-button ${profile.activityLevel === level ? 'active' : ''}`}
                onClick={() => updateProfile('activityLevel', level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-section animate-in delay-3">
          <label className="field-label">Neutered?</label>
          <div className="option-row">
            <button
              className={`option-button ${profile.neutered === 'yes' ? 'active' : ''}`}
              onClick={() => updateProfile('neutered', 'yes')}
            >
              Yes
            </button>
            <button
              className={`option-button ${profile.neutered === 'no' ? 'active' : ''}`}
              onClick={() => updateProfile('neutered', 'no')}
            >
              No
            </button>
          </div>
        </div>
        
        <div className="form-section animate-in delay-4">
          <label className="field-label">Main goal</label>
          <div className="goal-options">
            {[
              { id: 'healthy-aging', label: 'Healthy aging', icon: '🌿' },
              { id: 'joint-support', label: 'Joint support', icon: '🦴' },
              { id: 'weight-support', label: 'Weight support', icon: '⚖️' },
              { id: 'digestion', label: 'Digestion', icon: '🌾' },
            ].map(goal => (
              <button
                key={goal.id}
                className={`goal-button ${profile.goalFocus === goal.id ? 'active' : ''}`}
                onClick={() => updateProfile('goalFocus', goal.id)}
              >
                <span className="goal-icon">{goal.icon}</span>
                <span className="goal-label">{goal.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="step-indicator animate-in delay-5">
          <span className="step-dot"></span>
          <span className="step-dot active"></span>
        </div>
        
        <button 
          className="primary-button animate-in delay-5"
          onClick={() => onComplete(profile)}
        >
          Start tracking
        </button>
      </div>
      
      <style>{profileStyles}</style>
    </div>
  );
};

const profileStyles = `
  .form-section {
    margin-bottom: 24px;
  }
  
  .form-row {
    display: flex;
    gap: 16px;
  }
  
  .form-section.half {
    flex: 1;
  }
  
  .option-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .option-button {
    padding: 12px 18px;
    font-size: 14px;
    font-family: inherit;
    text-transform: capitalize;
    border: 2px solid #E8E4DC;
    border-radius: 10px;
    background: #FFFFFF;
    color: #5C5852;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .option-button:hover {
    border-color: #B5B0A8;
  }
  
  .option-button.active {
    border-color: #2D5A3D;
    background: rgba(45, 90, 61, 0.08);
    color: #2D5A3D;
    font-weight: 500;
  }
  
  .goal-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .goal-button {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: inherit;
    border: 2px solid #E8E4DC;
    border-radius: 12px;
    background: #FFFFFF;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .goal-button:hover {
    border-color: #B5B0A8;
  }
  
  .goal-button.active {
    border-color: #2D5A3D;
    background: rgba(45, 90, 61, 0.08);
  }
  
  .goal-icon {
    font-size: 20px;
  }
  
  .goal-label {
    font-size: 14px;
    color: #3D3A36;
  }
  
  .goal-button.active .goal-label {
    color: #2D5A3D;
    font-weight: 500;
  }
  
  .step-indicator {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 28px 0 20px;
  }
  
  .step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #E8E4DC;
  }
  
  .step-dot.active {
    background: #2D5A3D;
    width: 24px;
    border-radius: 4px;
  }
  
  .skip-text {
    text-align: center;
    font-size: 13px;
    color: #9A958E;
    margin-top: 16px;
  }
`;

// ============================================
// HOME SCREEN
// ============================================
const NutritionCheckRing = ({ score, confidence }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);
  
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  
  const getColor = (score) => {
    if (score >= 75) return '#2D5A3D';
    if (score >= 50) return '#D4A03D';
    return '#8B3A3A';
  };
  
  const getStatus = (score) => {
    if (score >= 75) return 'Looking good';
    if (score >= 50) return 'A few gaps';
    return 'Needs attention';
  };
  
  return (
    <div className="ring-container">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#E8E4DC"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={getColor(animatedScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 100 100)"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease'
          }}
        />
      </svg>
      <div className="ring-content">
        <span className="ring-score">{animatedScore}</span>
        <span className="ring-status">{getStatus(animatedScore)}</span>
      </div>
      <div className="confidence-badge">
        <span className="confidence-dot" style={{ background: confidence === 'High' ? '#2D5A3D' : confidence === 'Medium' ? '#D4A03D' : '#8B3A3A' }}></span>
        <span className="confidence-text">{confidence} confidence</span>
      </div>
    </div>
  );
};

// Nutrient Bar Component
const NutrientBar = ({ name, percentage, status, icon }) => {
  const getBarColor = (status) => {
    if (status === 'good') return '#2D5A3D';
    if (status === 'warning') return '#D4A03D';
    if (status === 'low') return '#8B3A3A';
    return '#B5B0A8';
  };
  
  const getStatusText = (status, percentage) => {
    if (status === 'good') return '✓';
    return `${percentage}%`;
  };
  
  return (
    <div className="nutrient-row">
      <div className="nutrient-label">
        <span className="nutrient-icon">{icon}</span>
        <span className="nutrient-name">{name}</span>
      </div>
      <div className="nutrient-bar-wrap">
        <div className="nutrient-bar-bg">
          <div 
            className="nutrient-bar-fill"
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              background: getBarColor(status)
            }}
          />
        </div>
        <span className="nutrient-status" style={{ color: getBarColor(status) }}>
          {getStatusText(status, percentage)}
        </span>
      </div>
    </div>
  );
};

const HomeScreen = ({ profile, todayLog, onLogItem, onDeleteItem, onViewHistory, onViewRoutines, onViewProfile }) => {
  // Calculate real data from todayLog
  const items = todayLog?.items || [];
  const totalCalories = todayLog?.totalCalories || 0;
  
  // Calculate calorie targets based on profile
  const weightKg = profile?.weight || 15;
  const activityMultiplier = profile?.activityLevel === 'active' ? 1.6 : profile?.activityLevel === 'low' ? 1.2 : 1.4;
  const baseCalories = Math.round(70 * Math.pow(weightKg, 0.75) * activityMultiplier);
  const calorieMin = Math.round(baseCalories * 0.9);
  const calorieMax = Math.round(baseCalories * 1.1);
  
  const calories = { current: totalCalories, min: calorieMin, max: calorieMax };
  const calorieStatus = totalCalories > calorieMax ? 'high' : totalCalories < calorieMin ? 'low' : 'good';
  
  // Calculate nutrient totals from logged items
  const calculateNutrients = () => {
    if (items.length === 0) {
      return [
        { name: 'Protein', percentage: 0, status: 'low', icon: '🥩' },
        { name: 'Fat', percentage: 0, status: 'low', icon: '🫒' },
        { name: 'Fiber', percentage: 0, status: 'low', icon: '🌾' },
        { name: 'Omega-3', percentage: 0, status: 'low', icon: '🐟' },
        { name: 'Calcium', percentage: 0, status: 'low', icon: '🦴' },
      ];
    }
    
    // Sum nutrients from all items
    const totals = { protein: 0, fat: 0, fiber: 0, omega3: 0, calcium: 0 };
    let hasNutrientData = false;
    
    items.forEach(item => {
      // Check if item has actual nutrient data
      if (item.nutrients && (item.nutrients.protein || item.nutrients.fat)) {
        hasNutrientData = true;
        totals.protein += item.nutrients.protein || 0;
        totals.fat += item.nutrients.fat || 0;
        totals.fiber += item.nutrients.fiber || 0;
        totals.omega3 += item.nutrients.omega3 || 0;
        totals.calcium += item.nutrients.calcium || 0;
      } else if (item.calories > 0) {
        // Estimate nutrients from calories (typical senior dog food ratios)
        // Protein: ~25% of calories = ~6.25g per 100kcal
        // Fat: ~15% of calories = ~1.67g per 100kcal  
        // Fiber: ~3% by weight
        const calFactor = item.calories / 100;
        totals.protein += 6.25 * calFactor;
        totals.fat += 1.67 * calFactor;
        totals.fiber += 0.5 * calFactor;
        totals.calcium += 0.03 * calFactor;
        // Omega-3 only if explicitly noted or supplement
        if (item.type === 'Supplement' || (item.name && item.name.toLowerCase().includes('fish'))) {
          totals.omega3 += 0.05 * calFactor;
        }
      }
    });
    
    // AAFCO senior targets (per 1000 kcal, scaled to actual calories)
    const scaleFactor = totalCalories > 0 ? totalCalories / 1000 : 1;
    const targets = {
      protein: 56.3 * scaleFactor,
      fat: 13.8 * scaleFactor,
      fiber: 5 * scaleFactor,
      omega3: 0.11 * scaleFactor, // 110mg = 0.11g per 1000kcal
      calcium: 1.25 * scaleFactor
    };
    
    const getStatus = (pct) => {
      if (isNaN(pct) || pct === 0) return 'low';
      return pct >= 80 ? 'good' : pct >= 50 ? 'warning' : 'low';
    };
    
    const calcPct = (val, target) => {
      if (target === 0) return 0;
      return Math.min(100, Math.round((val / target) * 100));
    };
    
    return [
      { name: 'Protein', percentage: calcPct(totals.protein, targets.protein), status: getStatus((totals.protein / targets.protein) * 100), icon: '🥩' },
      { name: 'Fat', percentage: calcPct(totals.fat, targets.fat), status: getStatus((totals.fat / targets.fat) * 100), icon: '🫒' },
      { name: 'Fiber', percentage: calcPct(totals.fiber, targets.fiber), status: getStatus((totals.fiber / targets.fiber) * 100), icon: '🌾' },
      { name: 'Omega-3', percentage: calcPct(totals.omega3, targets.omega3), status: getStatus((totals.omega3 / targets.omega3) * 100), icon: '🐟' },
      { name: 'Calcium', percentage: calcPct(totals.calcium, targets.calcium), status: getStatus((totals.calcium / targets.calcium) * 100), icon: '🦴' },
    ];
  };
  
  const nutrients = calculateNutrients();
  
  // Calculate gaps based on low nutrients
  const gaps = nutrients
    .filter(n => n.status === 'low' || n.status === 'warning')
    .map(n => ({ text: `${n.name} may be low`, icon: '⚠' }));
  
  // Suggested fixes based on gaps
  const fixes = [];
  if (nutrients.find(n => n.name === 'Omega-3' && n.status !== 'good')) {
    fixes.push('Add fish oil supplement');
  }
  if (nutrients.find(n => n.name === 'Protein' && n.status !== 'good')) {
    fixes.push('Add a protein-rich meal or topper');
  }
  if (nutrients.find(n => n.name === 'Fiber' && n.status !== 'good')) {
    fixes.push('Consider adding pumpkin or vegetables');
  }
  
  const itemCount = items.length;
  const confidence = itemCount >= 4 ? 'High' : itemCount >= 2 ? 'Medium' : itemCount > 0 ? 'Low' : 'No data';
  
  // Format items for display
  const displayItems = items.map(item => ({
    id: item.id,
    time: item.time,
    name: item.brand ? `${item.type} · ${item.brand} ${item.name}` : `${item.type} · ${item.name}`,
    calories: item.calories
  }));
  
  return (
    <div className="screen home-screen">
      <header className="home-header animate-in">
        <div className="dog-avatar">
          <svg viewBox="0 0 100 100" width="48" height="48">
            <circle cx="50" cy="50" r="50" fill="#E8E4DC"/>
            <ellipse cx="50" cy="62" rx="28" ry="24" fill="#8B7355"/>
            <circle cx="50" cy="48" r="22" fill="#A08060"/>
            <ellipse cx="38" cy="44" rx="5" ry="6" fill="#3D3A36"/>
            <ellipse cx="62" cy="44" rx="5" ry="6" fill="#3D3A36"/>
            <ellipse cx="50" cy="54" rx="6" ry="5" fill="#3D3A36"/>
            <ellipse cx="26" cy="38" rx="12" ry="16" fill="#8B7355" transform="rotate(-20 26 38)"/>
            <ellipse cx="74" cy="38" rx="12" ry="16" fill="#8B7355" transform="rotate(20 74 38)"/>
            <path d="M44 62 Q50 68 56 62" stroke="#3D3A36" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="header-text">
          <h1>{profile.name}'s Nutrition</h1>
          <p>Today · {confidence} confidence</p>
        </div>
      </header>
      
      <section className="calories-section animate-in delay-1">
        <div className="calories-card">
          <div className="calories-header">
            <span className="calories-label">Calories</span>
            <span className={`calories-value ${calorieStatus}`}>
              {calories.current} / {calories.min}-{calories.max} kcal
            </span>
          </div>
          <div className="calories-bar-bg">
            <div className="calories-target-zone" style={{ 
              left: '0%', 
              width: `${(calories.max / (calories.max * 1.3)) * 100}%` 
            }} />
            <div 
              className="calories-bar-fill"
              style={{ 
                width: `${Math.min((calories.current / (calories.max * 1.3)) * 100, 100)}%`,
                background: calorieStatus === 'good' ? '#2D5A3D' : '#D4A03D'
              }}
            />
          </div>
          <span className="calories-status">
            {calorieStatus === 'good' ? 'On track' : calorieStatus === 'high' ? 'Slightly high' : 'Below target'}
          </span>
        </div>
      </section>
      
      <section className="nutrients-section animate-in delay-2">
        <h3 className="section-label">Nutrients</h3>
        <div className="nutrients-card">
          {nutrients.map((nutrient, i) => (
            <NutrientBar key={i} {...nutrient} />
          ))}
        </div>
      </section>
      
      {gaps.length > 0 && (
        <section className="gaps-section animate-in delay-3">
          <h3 className="section-label">Likely gaps</h3>
          <div className="gaps-card">
            {gaps.map((gap, i) => (
              <div key={i} className="gap-row">
                <span className="gap-icon">{gap.icon}</span>
                <span className="gap-text">{gap.text}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {fixes.length > 0 && (
        <section className="fixes-section animate-in delay-4">
          <h3 className="section-label">Suggested fixes</h3>
          {fixes.map((fix, i) => (
            <div key={i} className="fix-item">
              <span className="fix-icon">→</span>
              <span className="fix-text">{fix}</span>
            </div>
          ))}
        </section>
      )}
      
      <section className="logged-section animate-in delay-5">
        <div className="logged-header">
          <h3 className="section-label">Logged today</h3>
          <span className="logged-count">{itemCount} items</span>
        </div>
        {displayItems.length === 0 ? (
          <p className="empty-text">Nothing logged yet. Tap + to add.</p>
        ) : (
          <div className="logged-list">
            {displayItems.slice(0, 5).map((item, i) => (
              <div key={item.id || i} className="logged-item">
                <span className="logged-time">{item.time}</span>
                <span className="logged-name">{item.name}</span>
                {item.calories > 0 && <span className="logged-cal">{item.calories} kcal</span>}
                <button 
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                >
                  ×
                </button>
              </div>
            ))}
            {displayItems.length > 5 && (
              <span className="logged-more">+{displayItems.length - 5} more</span>
            )}
          </div>
        )}
      </section>
      
      <div className="spacer"></div>
      
      <style>{homeStyles}</style>
    </div>
  );
};

const homeStyles = `
  .home-screen {
    padding-bottom: 100px;
  }
  
  .home-header {
    padding: 16px 24px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .dog-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(61, 58, 54, 0.12);
  }
  
  .header-text h1 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 20px;
    font-weight: 500;
    color: #2D2A26;
    letter-spacing: -0.3px;
  }
  
  .header-text p {
    font-size: 13px;
    color: #7A756E;
    margin-top: 2px;
  }
  
  .calories-section {
    padding: 0 24px 20px;
  }
  
  .calories-card {
    background: #FFFFFF;
    border-radius: 14px;
    padding: 16px 18px;
    box-shadow: 0 2px 10px rgba(61, 58, 54, 0.06);
  }
  
  .calories-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .calories-label {
    font-size: 14px;
    font-weight: 500;
    color: #3D3A36;
  }
  
  .calories-value {
    font-size: 14px;
    font-weight: 500;
  }
  
  .calories-value.good { color: #2D5A3D; }
  .calories-value.high { color: #D4A03D; }
  .calories-value.low { color: #8B3A3A; }
  
  .calories-bar-bg {
    height: 10px;
    background: #EFEBE4;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
  }
  
  .calories-target-zone {
    position: absolute;
    top: 0;
    height: 100%;
    background: rgba(45, 90, 61, 0.1);
  }
  
  .calories-bar-fill {
    height: 100%;
    border-radius: 5px;
    transition: width 0.8s ease;
  }
  
  .calories-status {
    display: block;
    font-size: 12px;
    color: #7A756E;
    margin-top: 8px;
  }
  
  .nutrients-section {
    padding: 0 24px 20px;
  }
  
  .nutrients-card {
    background: #FFFFFF;
    border-radius: 14px;
    padding: 12px 18px;
    box-shadow: 0 2px 10px rgba(61, 58, 54, 0.06);
  }
  
  .nutrient-row {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #F5F2ED;
  }
  
  .nutrient-row:last-child {
    border-bottom: none;
  }
  
  .nutrient-label {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100px;
  }
  
  .nutrient-icon {
    font-size: 14px;
  }
  
  .nutrient-name {
    font-size: 14px;
    color: #3D3A36;
  }
  
  .nutrient-bar-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .nutrient-bar-bg {
    flex: 1;
    height: 8px;
    background: #EFEBE4;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .nutrient-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.6s ease;
  }
  
  .nutrient-status {
    font-size: 12px;
    font-weight: 600;
    width: 32px;
    text-align: right;
  }
  
  .gaps-section {
    padding: 0 24px 16px;
  }
  
  .gaps-card {
    background: rgba(212, 160, 61, 0.08);
    border-radius: 12px;
    padding: 12px 16px;
  }
  
  .gap-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
  }
  
  .gap-icon {
    color: #D4A03D;
    font-size: 14px;
  }
  
  .gap-text {
    font-size: 14px;
    color: #8B6914;
  }
  
  .fixes-section {
    padding: 0 24px 16px;
  }
  
  .fix-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #EFEBE4;
  }
  
  .fix-item:last-child {
    border-bottom: none;
  }
  
  .fix-icon {
    color: #2D5A3D;
    font-size: 14px;
  }
  
  .fix-text {
    font-size: 14px;
    color: #3D3A36;
  }
  
  .logged-section {
    padding: 0 24px 24px;
  }
  
  .logged-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .logged-count {
    font-size: 12px;
    color: #9A958E;
  }
  
  .logged-list {
    background: #FFFFFF;
    border-radius: 12px;
    padding: 8px 14px;
    box-shadow: 0 2px 8px rgba(61, 58, 54, 0.05);
  }
  
  .logged-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #F5F2ED;
  }
  
  .logged-item:last-child {
    border-bottom: none;
  }
  
  .logged-time {
    font-size: 12px;
    color: #9A958E;
    width: 42px;
  }
  
  .logged-name {
    font-size: 13px;
    color: #5C5852;
    flex: 1;
  }
  
  .logged-cal {
    font-size: 12px;
    color: #9A958E;
    margin-right: 4px;
  }
  
  .delete-btn {
    background: none;
    border: none;
    color: #B5B0A8;
    font-size: 18px;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.15s ease;
  }
  
  .delete-btn:hover {
    background: rgba(139, 58, 58, 0.1);
    color: #8B3A3A;
  }
  
  .logged-more {
    display: block;
    font-size: 12px;
    color: #7A756E;
    text-align: center;
    padding: 8px 0 4px;
  }
  
  .empty-text {
    font-size: 14px;
    color: #9A958E;
    font-style: italic;
  }
  
  .spacer {
    height: 100px;
  }
`;

// ============================================
// HISTORY SCREEN
// ============================================
const HistoryScreen = ({ allLogs, onBack, onSelectDay }) => {
  // Convert allLogs object to sorted array
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const calculateDayScore = (log) => {
    if (!log.items || log.items.length === 0) return 0;
    const itemCount = log.items.length;
    const hasCalories = log.totalCalories > 0;
    // Simple scoring: more items + calories = higher score
    const baseScore = Math.min(itemCount * 15, 60);
    const calorieBonus = hasCalories ? 20 : 0;
    const confidenceBonus = itemCount >= 4 ? 20 : itemCount >= 2 ? 10 : 0;
    return Math.min(baseScore + calorieBonus + confidenceBonus, 100);
  };
  
  const days = Object.entries(allLogs || {})
    .sort((a, b) => b[0].localeCompare(a[0])) // Sort by date descending
    .slice(0, 14) // Last 14 days
    .map(([dateKey, log]) => {
      const score = calculateDayScore(log);
      const itemCount = log.items?.length || 0;
      return {
        dateKey,
        date: formatDate(dateKey),
        score,
        confidence: itemCount >= 4 ? 'High' : itemCount >= 2 ? 'Medium' : 'Low',
        status: itemCount >= 4 ? 'complete' : itemCount > 0 ? 'partial' : 'low-confidence',
        entries: itemCount,
        flags: score < 60 ? ['Needs attention'] : [],
        totalCalories: log.totalCalories || 0,
        items: log.items || []
      };
    });
  
  // Show empty state if no history
  if (days.length === 0) {
    return (
      <div className="screen">
        <div className="top-bar">
          <button className="back-button" onClick={onBack}>←</button>
          <span className="top-bar-title">History</span>
          <div style={{ width: 40 }}></div>
        </div>
        <div className="screen-content" style={{ textAlign: 'center', paddingTop: 60 }}>
          <p style={{ color: '#9A958E', fontSize: 15 }}>No history yet. Start logging to see your progress.</p>
        </div>
      </div>
    );
  }
  
  // Compute stats from last 7 days
  const last7Days = days.slice(0, 7);
  const avgScore = last7Days.length > 0 
    ? Math.round(last7Days.reduce((sum, d) => sum + d.score, 0) / last7Days.length)
    : 0;
  const daysLogged = last7Days.filter(d => d.status !== 'low-confidence').length;
  
  const getScoreColor = (score) => {
    if (score >= 75) return '#2D5A3D';
    if (score >= 50) return '#D4A03D';
    return '#8B3A3A';
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'complete': return 'Complete';
      case 'partial': return 'Partial';
      case 'low-confidence': return 'Low confidence';
      default: return '';
    }
  };
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">History</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="weekly-summary-card animate-in">
          <div className="summary-header-row">
            <h3 className="summary-title">This week</h3>
          </div>
          <div className="summary-inline">
            <span>Avg score: <strong>{avgScore}</strong></span>
            <span>Days logged: <strong>{daysLogged}/7</strong></span>
          </div>
        </div>
        
        <div className="history-list">
          {days.map((day, i) => (
            <button 
              key={i} 
              className={`history-card animate-in delay-${Math.min(i + 1, 5)}`}
              onClick={() => onSelectDay({...day, flag: day.flags[0] || null})}
            >
              <div className="history-left">
                <div className="history-score" style={{ background: getScoreColor(day.score) }}>
                  {day.score}
                </div>
                <div className="history-info">
                  <span className="history-date">{day.date}</span>
                  <span className="history-meta">
                    {getStatusLabel(day.status)} · {day.entries} items
                  </span>
                </div>
              </div>
              <div className="history-right">
                {day.flags[0] && <span className="history-flag">{day.flags[0]}</span>}
                <span className="history-arrow">›</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <style>{`
        .weekly-summary-card {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(61, 58, 54, 0.06);
        }
        
        .summary-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .summary-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 17px;
          font-weight: 500;
          color: #2D2A26;
        }
        
        .trend-badge {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 10px;
        }
        
        .trend-badge.positive {
          color: #2D5A3D;
          background: rgba(45, 90, 61, 0.1);
        }
        
        .trend-badge.negative {
          color: #8B3A3A;
          background: rgba(139, 58, 58, 0.1);
        }
        
        .summary-inline {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #7A756E;
        }
        
        .summary-inline strong {
          color: #2D2A26;
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .history-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FFFFFF;
          border: none;
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(61, 58, 54, 0.05);
          text-align: left;
          width: 100%;
        }
        
        .history-card:hover {
          box-shadow: 0 4px 12px rgba(61, 58, 54, 0.1);
        }
        
        .history-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        
        .history-score {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 18px;
          font-weight: 500;
          color: #FFFFFF;
        }
        
        .history-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .history-date {
          font-size: 15px;
          font-weight: 500;
          color: #2D2A26;
        }
        
        .history-meta {
          font-size: 13px;
          color: #9A958E;
        }
        
        .history-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .history-flag {
          font-size: 11px;
          color: #D4A03D;
          background: rgba(212, 160, 61, 0.12);
          padding: 4px 8px;
          border-radius: 6px;
        }
        
        .history-arrow {
          font-size: 20px;
          color: #B5B0A8;
        }
      `}</style>
    </div>
  );
};

// ============================================
// DAY DETAIL SCREEN
// ============================================
const DayDetailScreen = ({ day, onBack, onEditEntry, onAddItem }) => {
  // Use real items from day data
  const entries = (day.items || []).map(item => ({
    id: item.id,
    time: item.time || '—',
    type: item.type || 'Item',
    name: item.name || 'Unknown',
    amount: item.amount ? `${item.amount} ${item.unit || ''}` : '',
    cal: item.calories || 0
  }));
  
  // Calculate nutrients from items
  const calculateNutrients = () => {
    const items = day.items || [];
    const totalCal = day.totalCalories || 0;
    
    if (items.length === 0 || totalCal === 0) {
      return [
        { name: 'Protein', value: 0, status: 'low' },
        { name: 'Fat', value: 0, status: 'low' },
        { name: 'Fiber', value: 0, status: 'low' },
        { name: 'Omega-3', value: 0, status: 'low' },
        { name: 'Calcium', value: 0, status: 'low' },
      ];
    }
    
    const totals = { protein: 0, fat: 0, fiber: 0, omega3: 0, calcium: 0 };
    
    items.forEach(item => {
      if (item.nutrients && (item.nutrients.protein || item.nutrients.fat)) {
        totals.protein += item.nutrients.protein || 0;
        totals.fat += item.nutrients.fat || 0;
        totals.fiber += item.nutrients.fiber || 0;
        totals.omega3 += item.nutrients.omega3 || 0;
        totals.calcium += item.nutrients.calcium || 0;
      } else if (item.calories > 0) {
        const calFactor = item.calories / 100;
        totals.protein += 6.25 * calFactor;
        totals.fat += 1.67 * calFactor;
        totals.fiber += 0.5 * calFactor;
        totals.calcium += 0.03 * calFactor;
        if (item.type === 'Supplement' || (item.name && item.name.toLowerCase().includes('fish'))) {
          totals.omega3 += 0.05 * calFactor;
        }
      }
    });
    
    const scaleFactor = totalCal > 0 ? totalCal / 1000 : 1;
    const targets = {
      protein: 56.3 * scaleFactor,
      fat: 13.8 * scaleFactor,
      fiber: 5 * scaleFactor,
      omega3: 0.11 * scaleFactor,
      calcium: 1.25 * scaleFactor
    };
    
    const calcPct = (val, target) => target === 0 ? 0 : Math.min(100, Math.round((val / target) * 100));
    const getStatus = (pct) => pct >= 80 ? 'good' : pct >= 50 ? 'warning' : 'low';
    
    return [
      { name: 'Protein', value: calcPct(totals.protein, targets.protein), status: getStatus(calcPct(totals.protein, targets.protein)) },
      { name: 'Fat', value: calcPct(totals.fat, targets.fat), status: getStatus(calcPct(totals.fat, targets.fat)) },
      { name: 'Fiber', value: calcPct(totals.fiber, targets.fiber), status: getStatus(calcPct(totals.fiber, targets.fiber)) },
      { name: 'Omega-3', value: calcPct(totals.omega3, targets.omega3), status: getStatus(calcPct(totals.omega3, targets.omega3)) },
      { name: 'Calcium', value: calcPct(totals.calcium, targets.calcium), status: getStatus(calcPct(totals.calcium, targets.calcium)) },
    ];
  };
  
  const nutrients = calculateNutrients();
  const totalCalories = day.totalCalories || entries.reduce((sum, e) => sum + (e.cal || 0), 0);
  
  const getScoreColor = (score) => {
    if (score >= 75) return '#2D5A3D';
    if (score >= 50) return '#D4A03D';
    return '#8B3A3A';
  };
  
  const getBarColor = (status) => {
    if (status === 'good') return '#2D5A3D';
    if (status === 'warning') return '#D4A03D';
    return '#8B3A3A';
  };
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">{day.date}</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="day-summary animate-in">
          <div className="day-score-large" style={{ background: getScoreColor(day.score) }}>
            {day.score}
          </div>
          <div className="day-summary-text">
            <span className="day-status-label">{day.status === 'complete' ? 'Complete day' : 'Partial day'}</span>
            <span className="day-confidence">{day.confidence} confidence</span>
          </div>
        </div>
        
        <div className="day-section animate-in delay-1">
          <h3 className="section-label">Nutrients</h3>
          <div className="nutrients-card">
            {nutrients.map((nutrient, i) => (
              <div key={i} className="nutrient-row">
                <span className="nutrient-name">{nutrient.name}</span>
                <div className="nutrient-bar-container">
                  <div 
                    className="nutrient-bar" 
                    style={{ 
                      width: `${nutrient.value}%`,
                      background: getBarColor(nutrient.status)
                    }}
                  ></div>
                </div>
                <span className="nutrient-value">{nutrient.value}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {day.flags && day.flags[0] && (
          <div className="day-flag animate-in delay-2">
            <span className="flag-icon">⚠</span>
            <span className="flag-text">{day.flags[0]}</span>
          </div>
        )}
        
        <div className="day-section animate-in delay-3">
          <h3 className="section-label">Timeline</h3>
          {entries.length === 0 ? (
            <p className="empty-text">No items logged this day.</p>
          ) : (
            <div className="timeline-card">
              {entries.map((entry, i) => (
                <button key={entry.id || i} className="timeline-entry" onClick={() => onEditEntry(entry)}>
                  <span className="entry-time">{entry.time}</span>
                  <div className="entry-details">
                    <span className="entry-type">{entry.type}</span>
                    <span className="entry-name">{entry.name}</span>
                  </div>
                  <div className="entry-right">
                    <span className="entry-cal">{entry.cal} kcal</span>
                    <span className="entry-arrow">›</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="day-total animate-in delay-4">
          <span>Total calories</span>
          <span className="total-value">{totalCalories.toLocaleString()} kcal</span>
        </div>
        
        <button className="secondary-button full-width animate-in delay-5" onClick={onAddItem}>
          Add missed item
        </button>
      </div>
      
      <style>{`
        .day-summary {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 28px;
        }
        
        .day-score-large {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 28px;
          font-weight: 500;
          color: #FFFFFF;
        }
        
        .day-summary-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .day-status-label {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 20px;
          font-weight: 500;
          color: #2D2A26;
        }
        
        .day-confidence {
          font-size: 14px;
          color: #7A756E;
        }
        
        .day-section {
          margin-bottom: 24px;
        }
        
        .nutrients-card {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 16px 18px;
          box-shadow: 0 2px 8px rgba(61, 58, 54, 0.06);
        }
        
        .nutrient-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #F5F2ED;
        }
        
        .nutrient-row:last-child {
          border-bottom: none;
        }
        
        .nutrient-name {
          font-size: 14px;
          color: #3D3A36;
          width: 70px;
        }
        
        .nutrient-bar-container {
          flex: 1;
          height: 8px;
          background: #EFEBE4;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .nutrient-bar {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
        }
        
        .nutrient-value {
          font-size: 13px;
          color: #7A756E;
          width: 36px;
          text-align: right;
        }
        
        .day-flag {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(212, 160, 61, 0.12);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 24px;
        }
        
        .flag-icon {
          font-size: 18px;
        }
        
        .flag-text {
          font-size: 14px;
          color: #8B6914;
        }
        
        .timeline-card {
          background: #FFFFFF;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(61, 58, 54, 0.06);
        }
        
        .timeline-entry {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          border-bottom: 1px solid #F5F2ED;
          transition: background 0.15s ease;
        }
        
        .timeline-entry:last-child {
          border-bottom: none;
        }
        
        .timeline-entry:hover {
          background: #FAF8F3;
        }
        
        .entry-time {
          font-size: 13px;
          color: #9A958E;
          width: 44px;
        }
        
        .entry-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .entry-type {
          font-size: 11px;
          color: #9A958E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .entry-name {
          font-size: 15px;
          color: #2D2A26;
        }
        
        .entry-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .entry-cal {
          font-size: 13px;
          color: #7A756E;
        }
        
        .entry-arrow {
          font-size: 18px;
          color: #B5B0A8;
        }
        
        .day-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          margin-bottom: 20px;
          border-top: 1px solid #E8E4DC;
        }
        
        .total-value {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 20px;
          font-weight: 500;
          color: #2D2A26;
        }
        
        .full-width {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

// ============================================
// PROFILE / SETTINGS SCREEN
// ============================================
const ProfileSettingsScreen = ({ profile, onBack, onUpdateProfile }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  
  const updateField = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    onUpdateProfile(editedProfile);
    setEditMode(false);
  };
  
  const goalLabels = {
    'healthy-aging': 'Healthy aging',
    'joint-support': 'Joint support',
    'weight-support': 'Weight support',
    'digestion': 'Digestion'
  };
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">Profile</span>
        <button 
          className="edit-button" 
          onClick={() => editMode ? handleSave() : setEditMode(true)}
        >
          {editMode ? 'Save' : 'Edit'}
        </button>
      </div>
      
      <div className="screen-content">
        <div className="profile-header animate-in">
          <div className="profile-avatar">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <circle cx="50" cy="50" r="50" fill="#E8E4DC"/>
              <ellipse cx="50" cy="62" rx="28" ry="24" fill="#8B7355"/>
              <circle cx="50" cy="48" r="22" fill="#A08060"/>
              <ellipse cx="38" cy="44" rx="5" ry="6" fill="#3D3A36"/>
              <ellipse cx="62" cy="44" rx="5" ry="6" fill="#3D3A36"/>
              <ellipse cx="50" cy="54" rx="6" ry="5" fill="#3D3A36"/>
              <ellipse cx="26" cy="38" rx="12" ry="16" fill="#8B7355" transform="rotate(-20 26 38)"/>
              <ellipse cx="74" cy="38" rx="12" ry="16" fill="#8B7355" transform="rotate(20 74 38)"/>
              <path d="M44 62 Q50 68 56 62" stroke="#3D3A36" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-subtitle">{profile.age} years · {profile.breed || 'Dog'} · {profile.weight} kg</p>
        </div>
        
        <div className="settings-section animate-in delay-1">
          <h3 className="section-label">Dog details</h3>
          <div className="settings-card">
            <div className="setting-row">
              <span className="setting-label">Name</span>
              {editMode ? (
                <input 
                  type="text" 
                  className="setting-input"
                  value={editedProfile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              ) : (
                <span className="setting-value">{profile.name}</span>
              )}
            </div>
            <div className="setting-row">
              <span className="setting-label">Age</span>
              {editMode ? (
                <input 
                  type="number" 
                  className="setting-input small"
                  value={editedProfile.age}
                  onChange={(e) => updateField('age', e.target.value)}
                />
              ) : (
                <span className="setting-value">{profile.age} years</span>
              )}
            </div>
            <div className="setting-row">
              <span className="setting-label">Weight</span>
              {editMode ? (
                <input 
                  type="number" 
                  className="setting-input small"
                  value={editedProfile.weight}
                  onChange={(e) => updateField('weight', e.target.value)}
                />
              ) : (
                <span className="setting-value">{profile.weight} kg</span>
              )}
            </div>
            <div className="setting-row">
              <span className="setting-label">Breed</span>
              {editMode ? (
                <input 
                  type="text" 
                  className="setting-input"
                  value={editedProfile.breed || ''}
                  onChange={(e) => updateField('breed', e.target.value)}
                />
              ) : (
                <span className="setting-value">{profile.breed || 'Not set'}</span>
              )}
            </div>
            <div className="setting-row">
              <span className="setting-label">Activity</span>
              <span className="setting-value capitalize">{profile.activityLevel}</span>
            </div>
            <div className="setting-row">
              <span className="setting-label">Neutered</span>
              <span className="setting-value">{profile.neutered === 'yes' ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
        
        <div className="settings-section animate-in delay-2">
          <h3 className="section-label">Goal focus</h3>
          <div className="settings-card">
            <div className="setting-row single">
              <span className="goal-current">{goalLabels[profile.goalFocus] || 'Healthy aging'}</span>
              <button className="change-button">Change</button>
            </div>
          </div>
        </div>
        
        <div className="settings-section animate-in delay-3">
          <h3 className="section-label">Calorie target</h3>
          <div className="settings-card">
            <div className="calorie-display">
              <span className="calorie-range">720 - 850</span>
              <span className="calorie-unit">kcal/day</span>
            </div>
            <p className="calorie-note">Based on your dog's profile. Updated automatically when you change weight or activity.</p>
          </div>
        </div>
        
        <div className="settings-section animate-in delay-4">
          <h3 className="section-label">App settings</h3>
          <div className="settings-card">
            <div className="setting-row">
              <span className="setting-label">Units</span>
              <span className="setting-value">Metric (kg, g)</span>
            </div>
            <div className="setting-row">
              <span className="setting-label">Reminders</span>
              <span className="setting-value">Off</span>
            </div>
          </div>
        </div>
        
        <button className="danger-button animate-in delay-5">
          Delete dog profile
        </button>
      </div>
      
      <style>{`
        .edit-button {
          background: none;
          border: none;
          font-size: 16px;
          font-weight: 500;
          color: #2D5A3D;
          cursor: pointer;
          padding: 8px;
        }
        
        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0 32px;
        }
        
        .profile-avatar {
          margin-bottom: 16px;
        }
        
        .profile-name {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 26px;
          font-weight: 500;
          color: #2D2A26;
          margin-bottom: 4px;
        }
        
        .profile-subtitle {
          font-size: 15px;
          color: #7A756E;
        }
        
        .settings-section {
          margin-bottom: 24px;
        }
        
        .settings-card {
          background: #FFFFFF;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(61, 58, 54, 0.06);
        }
        
        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid #F5F2ED;
        }
        
        .setting-row:last-child {
          border-bottom: none;
        }
        
        .setting-row.single {
          padding: 18px;
        }
        
        .setting-label {
          font-size: 15px;
          color: #3D3A36;
        }
        
        .setting-value {
          font-size: 15px;
          color: #7A756E;
        }
        
        .setting-value.capitalize {
          text-transform: capitalize;
        }
        
        .setting-input {
          border: 1px solid #E8E4DC;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 15px;
          font-family: inherit;
          color: #3D3A36;
          text-align: right;
          width: 140px;
        }
        
        .setting-input.small {
          width: 80px;
        }
        
        .setting-input:focus {
          outline: none;
          border-color: #2D5A3D;
        }
        
        .goal-current {
          font-size: 16px;
          font-weight: 500;
          color: #2D2A26;
        }
        
        .change-button {
          background: none;
          border: none;
          font-size: 14px;
          color: #2D5A3D;
          cursor: pointer;
        }
        
        .calorie-display {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 18px;
          padding-bottom: 8px;
        }
        
        .calorie-range {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 28px;
          font-weight: 500;
          color: #2D5A3D;
        }
        
        .calorie-unit {
          font-size: 14px;
          color: #7A756E;
        }
        
        .calorie-note {
          font-size: 13px;
          color: #9A958E;
          padding: 0 18px 18px;
          line-height: 1.5;
        }
        
        .danger-button {
          width: 100%;
          padding: 16px;
          font-size: 15px;
          font-family: inherit;
          color: #8B3A3A;
          background: none;
          border: 1px solid #E8E4DC;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 8px;
        }
        
        .danger-button:hover {
          background: rgba(139, 58, 58, 0.05);
          border-color: #8B3A3A;
        }
      `}</style>
    </div>
  );
};

// ============================================
// ROUTINES SCREEN
// ============================================
const RoutinesScreen = ({ onBack, onUseRoutine, onCreateRoutine }) => {
  const [routines, setRoutines] = useState([
    { 
      id: 1, 
      name: 'Morning routine', 
      items: [
        { type: 'Meal', name: 'Senior kibble', amount: '1.5 cups' },
        { type: 'Supplement', name: 'Fish oil', amount: '1 pump' }
      ],
      totalCal: 585,
      usedCount: 12
    },
    { 
      id: 2, 
      name: 'Evening routine', 
      items: [
        { type: 'Meal', name: 'Senior kibble', amount: '1 cup' },
        { type: 'Supplement', name: 'Joint chew', amount: '1 piece' }
      ],
      totalCal: 420,
      usedCount: 8
    },
    { 
      id: 3, 
      name: 'Training day', 
      items: [
        { type: 'Treat', name: 'Training biscuits', amount: '10 pieces' }
      ],
      totalCal: 150,
      usedCount: 3
    },
  ]);
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">Routines</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="screen-header animate-in">
          <h1 className="screen-title">Your routines</h1>
          <p className="screen-subtitle">Log multiple items with one tap</p>
        </div>
        
        <div className="routines-list">
          {routines.map((routine, i) => (
            <div key={routine.id} className={`routine-card animate-in delay-${Math.min(i + 1, 4)}`}>
              <div className="routine-header">
                <h3 className="routine-name">{routine.name}</h3>
                <span className="routine-cal">{routine.totalCal} kcal</span>
              </div>
              
              <div className="routine-items">
                {routine.items.map((item, j) => (
                  <div key={j} className="routine-item">
                    <span className="routine-item-type">{item.type}</span>
                    <span className="routine-item-name">{item.name}</span>
                    <span className="routine-item-amount">{item.amount}</span>
                  </div>
                ))}
              </div>
              
              <div className="routine-footer">
                <span className="routine-used">Used {routine.usedCount} times</span>
                <div className="routine-actions">
                  <button className="routine-edit">Edit</button>
                  <button className="routine-use" onClick={() => onUseRoutine(routine)}>
                    Use now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="create-routine-button animate-in delay-5" onClick={onCreateRoutine}>
          <span className="create-icon">+</span>
          <span>Create new routine</span>
        </button>
        
        <div className="routine-tip animate-in delay-5">
          <span className="tip-icon">💡</span>
          <p className="tip-text">Routines save time when you feed the same things regularly. Create one for breakfast, dinner, or training days.</p>
        </div>
      </div>
      
      <style>{`
        .routines-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .routine-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 2px 10px rgba(61, 58, 54, 0.07);
        }
        
        .routine-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        
        .routine-name {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 18px;
          font-weight: 500;
          color: #2D2A26;
        }
        
        .routine-cal {
          font-size: 14px;
          color: #7A756E;
          background: #F5F2ED;
          padding: 4px 10px;
          border-radius: 8px;
        }
        
        .routine-items {
          border-top: 1px solid #F5F2ED;
          border-bottom: 1px solid #F5F2ED;
          padding: 10px 0;
          margin-bottom: 14px;
        }
        
        .routine-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }
        
        .routine-item-type {
          font-size: 11px;
          color: #9A958E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: 80px;
        }
        
        .routine-item-name {
          flex: 1;
          font-size: 14px;
          color: #3D3A36;
        }
        
        .routine-item-amount {
          font-size: 13px;
          color: #7A756E;
        }
        
        .routine-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .routine-used {
          font-size: 12px;
          color: #9A958E;
        }
        
        .routine-actions {
          display: flex;
          gap: 10px;
        }
        
        .routine-edit {
          background: none;
          border: none;
          font-size: 14px;
          color: #7A756E;
          cursor: pointer;
          padding: 8px 12px;
        }
        
        .routine-use {
          background: #2D5A3D;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: #FFFFFF;
          cursor: pointer;
          padding: 10px 18px;
          transition: background 0.2s ease;
        }
        
        .routine-use:hover {
          background: #245231;
        }
        
        .create-routine-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px;
          font-size: 16px;
          font-family: inherit;
          font-weight: 500;
          color: #2D5A3D;
          background: #FFFFFF;
          border: 2px dashed #D4CFC4;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 24px;
        }
        
        .create-routine-button:hover {
          border-color: #2D5A3D;
          background: rgba(45, 90, 61, 0.04);
        }
        
        .create-icon {
          font-size: 20px;
        }
        
        .routine-tip {
          display: flex;
          gap: 12px;
          background: #F5F2ED;
          border-radius: 12px;
          padding: 16px;
        }
        
        .tip-icon {
          font-size: 18px;
        }
        
        .tip-text {
          font-size: 14px;
          color: #5C5852;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

// ============================================
// LOG ITEM FLOW SCREENS
// ============================================
const ItemTypeScreen = ({ onSelect, onClose }) => {
  const itemTypes = [
    { id: 'meal', icon: '🍽', label: 'Meal', desc: 'Breakfast, lunch, dinner' },
    { id: 'treat', icon: '🦴', label: 'Treat', desc: 'Snacks, training rewards' },
    { id: 'supplement', icon: '💊', label: 'Supplement', desc: 'Vitamins, oils, chews' },
    { id: 'extra', icon: '🥕', label: 'Extra', desc: 'Toppers, scraps, extras' },
  ];
  
  return (
    <div className="screen">
      <div className="top-bar">
        <div style={{ width: 40 }}></div>
        <span className="top-bar-title">Log item</span>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>
      
      <div className="screen-content">
        <div className="screen-header animate-in">
          <h1 className="screen-title">What are you logging?</h1>
        </div>
        
        <div className="item-type-grid">
          {itemTypes.map((item, i) => (
            <button 
              key={item.id}
              className={`item-type-card animate-in delay-${i + 1}`}
              onClick={() => onSelect(item.id)}
            >
              <span className="item-type-icon">{item.icon}</span>
              <span className="item-type-label">{item.label}</span>
              <span className="item-type-desc">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>
      
      <style>{logStyles}</style>
    </div>
  );
};

const EntryMethodScreen = ({ itemType, onSelect, onBack }) => {
  // Different methods based on item type
  const getMethodsForType = () => {
    switch(itemType) {
      case 'meal':
        return [
          { id: 'search', icon: '🔍', label: 'Search food', desc: 'Kibble, wet food, or ingredients', tag: 'Most accurate' },
          { id: 'describe', icon: '✏️', label: 'Describe it', desc: 'Mixed meals or homemade', tag: null },
        ];
      case 'treat':
        return [
          { id: 'quick', icon: '⚡', label: 'Quick add', desc: 'Common treats with preset calories', tag: 'Fastest' },
          { id: 'search', icon: '🔍', label: 'Search treat', desc: 'Find specific brand or type', tag: null },
        ];
      case 'supplement':
        return [
          { id: 'quick', icon: '⚡', label: 'Quick add', desc: 'Fish oil, vitamins, joint chews', tag: 'Fastest' },
          { id: 'search', icon: '🔍', label: 'Search supplement', desc: 'Find specific brand', tag: null },
        ];
      case 'extra':
        return [
          { id: 'search', icon: '🔍', label: 'Search ingredient', desc: 'Chicken, veggies, toppers', tag: 'Most accurate' },
          { id: 'describe', icon: '✏️', label: 'Describe it', desc: 'Table scraps or mixed extras', tag: null },
        ];
      default:
        return [
          { id: 'search', icon: '🔍', label: 'Search', desc: 'Find in database', tag: null },
          { id: 'describe', icon: '✏️', label: 'Describe it', desc: 'Estimate from description', tag: null },
        ];
    }
  };
  
  const methods = getMethodsForType();
  const typeLabels = { meal: 'meal', treat: 'treat', supplement: 'supplement', extra: 'extra' };
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">Log {typeLabels[itemType] || itemType}</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="screen-header animate-in">
          <h1 className="screen-title">How do you want to add this?</h1>
        </div>
        
        <div className="method-list">
          {methods.map((method, i) => (
            <button 
              key={method.id}
              className={`method-card animate-in delay-${i + 1}`}
              onClick={() => onSelect(method.id)}
            >
              <div className="method-icon">{method.icon}</div>
              <div className="method-content">
                <div className="method-top">
                  <span className="method-label">{method.label}</span>
                  {method.tag && <span className="method-tag">{method.tag}</span>}
                </div>
                <span className="method-desc">{method.desc}</span>
              </div>
              <span className="method-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
      
      <style>{logStyles}</style>
    </div>
  );
};

// Quick Add screen for treats and supplements
const QuickAddScreen = ({ itemType, onSave, onBack, onSearchInstead }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [amount, setAmount] = useState('1');
  
  const quickItems = itemType === 'treat' ? [
    { id: 't1', name: 'Training treat (small)', cal: 5, unit: 'piece', icon: '🦴' },
    { id: 't2', name: 'Biscuit treat', cal: 35, unit: 'piece', icon: '🍪' },
    { id: 't3', name: 'Dental chew', cal: 70, unit: 'piece', icon: '🦷' },
    { id: 't4', name: 'Jerky strip', cal: 30, unit: 'piece', icon: '🥓' },
    { id: 't5', name: 'Cheese cube', cal: 40, unit: 'piece', icon: '🧀' },
    { id: 't6', name: 'Freeze-dried meat', cal: 15, unit: 'piece', icon: '🥩' },
  ] : [
    { id: 's1', name: 'Fish oil', cal: 15, unit: 'pump', icon: '🐟', nutrients: { omega3: 0.3 } },
    { id: 's2', name: 'Salmon oil', cal: 15, unit: 'pump', icon: '🐠', nutrients: { omega3: 0.35 } },
    { id: 's3', name: 'Glucosamine chew', cal: 10, unit: 'chew', icon: '💊' },
    { id: 's4', name: 'Probiotic', cal: 5, unit: 'scoop', icon: '🦠' },
    { id: 's5', name: 'Multivitamin', cal: 5, unit: 'tablet', icon: '💎' },
    { id: 's6', name: 'Joint supplement', cal: 15, unit: 'chew', icon: '🦴' },
  ];
  
  const handleSave = () => {
    if (!selectedItem) return;
    const qty = parseFloat(amount) || 1;
    onSave({
      name: selectedItem.name,
      calories: selectedItem.cal * qty,
      amount: qty,
      unit: selectedItem.unit,
      nutrients: selectedItem.nutrients || {},
      confidence: 'high'
    });
  };
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">Quick add {itemType}</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="screen-header animate-in">
          <h1 className="screen-title">Pick a {itemType}</h1>
          <p className="screen-subtitle">Tap to select, then set amount</p>
        </div>
        
        <div className="quick-grid animate-in delay-1">
          {quickItems.map((item) => (
            <button 
              key={item.id}
              className={`quick-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <span className="quick-icon">{item.icon}</span>
              <span className="quick-name">{item.name}</span>
              <span className="quick-cal">{item.cal} kcal/{item.unit}</span>
            </button>
          ))}
        </div>
        
        {selectedItem && (
          <div className="quick-amount-section animate-in">
            <label className="field-label">How many?</label>
            <div className="quick-amount-row">
              <button 
                className="amount-btn"
                onClick={() => setAmount(String(Math.max(1, (parseFloat(amount) || 1) - 1)))}
              >−</button>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="quick-amount-input"
                min="1"
              />
              <button 
                className="amount-btn"
                onClick={() => setAmount(String((parseFloat(amount) || 1) + 1))}
              >+</button>
              <span className="amount-unit">{selectedItem.unit}s</span>
            </div>
            <div className="quick-total">
              Total: {Math.round(selectedItem.cal * (parseFloat(amount) || 1))} kcal
            </div>
          </div>
        )}
        
        <div className="quick-actions animate-in delay-2">
          {selectedItem && (
            <button className="primary-button" onClick={handleSave}>
              Add {itemType}
            </button>
          )}
          <button className="text-link" onClick={onSearchInstead}>
            Search for specific brand instead
          </button>
        </div>
      </div>
      
      <style>{`
        .quick-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }
        .quick-item {
          background: #FFFFFF;
          border: 2px solid #E8E4DC;
          border-radius: 12px;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .quick-item:hover {
          border-color: #2D5A3D;
        }
        .quick-item.selected {
          border-color: #2D5A3D;
          background: rgba(45, 90, 61, 0.05);
        }
        .quick-icon { font-size: 24px; }
        .quick-name { 
          font-size: 13px; 
          font-weight: 500; 
          color: #2D2A26;
          text-align: center;
        }
        .quick-cal { 
          font-size: 11px; 
          color: #9A958E; 
        }
        .quick-amount-section {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(61, 58, 54, 0.06);
        }
        .quick-amount-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .amount-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 2px solid #E8E4DC;
          background: #FFFFFF;
          font-size: 20px;
          font-weight: 500;
          color: #2D5A3D;
          cursor: pointer;
        }
        .amount-btn:hover {
          border-color: #2D5A3D;
          background: rgba(45, 90, 61, 0.05);
        }
        .quick-amount-input {
          width: 60px;
          height: 44px;
          border: 2px solid #E8E4DC;
          border-radius: 10px;
          text-align: center;
          font-size: 18px;
          font-weight: 500;
          font-family: inherit;
        }
        .amount-unit {
          font-size: 14px;
          color: #7A756E;
        }
        .quick-total {
          margin-top: 14px;
          font-size: 15px;
          font-weight: 500;
          color: #2D5A3D;
          text-align: center;
        }
        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }
        .text-link {
          background: none;
          border: none;
          color: #7A756E;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
      <style>{logStyles}</style>
    </div>
  );
};

const ProductSearchScreen = ({ onSelect, onBack, onDescribe }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const recentProducts = [
    { id: 1, brand: 'Purina Pro Plan', name: 'Senior 7+ Chicken & Rice', cal: '380 kcal/cup' },
    { id: 2, brand: 'Blue Buffalo', name: 'Life Protection Senior', cal: '357 kcal/cup' },
  ];
  
  // Search API when query changes
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const searchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${window.API_BASE_URL || ''}/api/products?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        if (data.results) {
          setSearchResults(data.results.map(p => ({
            id: p.id,
            brand: p.brand,
            name: p.name,
            type: p.type || 'product',
            display: p.display || (p.brand ? `${p.brand} ${p.name}` : p.name),
            cal: p.subtitle || (p.kcal_per_serving ? `${Math.round(p.kcal_per_serving)} kcal/${p.serving_unit || 'serving'}` : ''),
            kcal_per_serving: p.kcal_per_serving,
            serving_unit: p.serving_unit,
            nutrients: p.nutrients || {}
          })));
        }
      } catch (err) {
        console.error('Search error:', err);
      }
      setLoading(false);
    };
    
    const timer = setTimeout(searchProducts, 300);
    return () => clearTimeout(timer);
  }, [query]);
  
  const showResults = query.length > 0;
  const products = showResults ? searchResults : recentProducts;
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">Search food</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className={`search-box ${focused ? 'focused' : ''}`}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search food, ingredient, or brand..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="search-input"
          />
          {query && (
            <button className="clear-btn" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
        
        {loading && <p className="loading-hint">Searching...</p>}
        
        <h3 className="section-label">{showResults ? 'Results' : 'Recent'}</h3>
        
        <div className="product-list">
          {products.map((product, i) => (
            <button 
              key={product.id}
              className={`product-card animate-in delay-${Math.min(i + 1, 5)}`}
              onClick={() => onSelect(product)}
            >
              <div className="product-info">
                {product.brand ? (
                  <>
                    <span className="product-brand">{product.brand}</span>
                    <span className="product-name">{product.name}</span>
                  </>
                ) : (
                  <span className="product-name">{product.name}</span>
                )}
              </div>
              <div className="product-right">
                <span className="product-cal">{product.cal}</span>
                <span className={`product-type-badge ${product.type}`}>
                  {product.type === 'ingredient' ? 'Ingredient' : 'Product'}
                </span>
              </div>
            </button>
          ))}
          {showResults && products.length === 0 && !loading && (
            <p className="no-results">No matches found</p>
          )}
        </div>
        
        <p className="search-hint">
          Can't find it? <button className="link-btn" onClick={onDescribe}>Describe it instead</button>
        </p>
      </div>
      
      <style>{logStyles}</style>
    </div>
  );
};

const AmountScreen = ({ product, onSave, onBack }) => {
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('cup');
  const [timeOption, setTimeOption] = useState('now');
  
  const units = ['cup', '½ cup', 'scoop', 'can'];
  
  // Parse calories from product
  const baseCalories = product.kcal_per_serving || 
    (product.cal ? parseInt(product.cal.match(/\d+/)?.[0] || 0) : 380);
  
  // Adjust for unit
  const unitMultiplier = unit === '½ cup' ? 0.5 : 1;
  const estimatedCal = Math.round(parseFloat(amount || 0) * baseCalories * unitMultiplier);
  
  const getTimeString = () => {
    const now = new Date();
    if (timeOption === 'now') {
      return now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    } else if (timeOption === 'morning') {
      return '8:00';
    } else {
      return '12:00';
    }
  };
  
  const handleSave = () => {
    onSave({
      name: product.name,
      brand: product.brand,
      amount: parseFloat(amount) * unitMultiplier,
      unit: unit === '½ cup' ? 'cup' : unit,
      calories: estimatedCal,
      nutrients: product.guaranteed_analysis || {},
      confidence: 'high',
      time: getTimeString()
    });
  };
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">Add amount</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="selected-product animate-in">
          <span className="selected-brand">{product.brand}</span>
          <span className="selected-name">{product.name}</span>
        </div>
        
        <div className="form-section animate-in delay-1">
          <label className="field-label">How much?</label>
          <div className="amount-row">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
              step="0.5"
              min="0"
            />
            <div className="unit-selector">
              {units.map((u) => (
                <button
                  key={u}
                  className={`unit-btn ${unit === u ? 'active' : ''}`}
                  onClick={() => setUnit(u)}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="estimate-box animate-in delay-2">
          <span className="estimate-label">Estimated</span>
          <span className="estimate-value">{estimatedCal} kcal</span>
        </div>
        
        <div className="form-section animate-in delay-3">
          <label className="field-label">When?</label>
          <div className="time-options">
            <button 
              className={`time-btn ${timeOption === 'now' ? 'active' : ''}`}
              onClick={() => setTimeOption('now')}
            >Now</button>
            <button 
              className={`time-btn ${timeOption === 'morning' ? 'active' : ''}`}
              onClick={() => setTimeOption('morning')}
            >This morning</button>
            <button 
              className={`time-btn ${timeOption === 'earlier' ? 'active' : ''}`}
              onClick={() => setTimeOption('earlier')}
            >Earlier</button>
          </div>
        </div>
        
        <button className="primary-button animate-in delay-4" onClick={handleSave}>
          Save item
        </button>
      </div>
      
      <style>{logStyles}</style>
    </div>
  );
};

const DescribeScreen = ({ onEstimate, onBack }) => {
  const [description, setDescription] = useState('');
  const [portion, setPortion] = useState('medium');
  
  const canEstimate = description.length > 3;
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">Describe item</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="screen-header animate-in">
          <h1 className="screen-title">What did they eat?</h1>
          <p className="screen-subtitle">Describe it in your own words</p>
        </div>
        
        <div className="form-section animate-in delay-1">
          <textarea
            placeholder="e.g., Half bowl of kibble with some cooked chicken on top"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="describe-textarea"
            rows={4}
          />
        </div>
        
        <div className="form-section animate-in delay-2">
          <label className="field-label">Portion size</label>
          <div className="portion-options">
            {['small', 'medium', 'large'].map((p) => (
              <button
                key={p}
                className={`portion-btn ${portion === p ? 'active' : ''}`}
                onClick={() => setPortion(p)}
              >
                <span className="portion-icon">{p === 'small' ? '○' : p === 'medium' ? '◐' : '●'}</span>
                <span>{p}</span>
              </button>
            ))}
          </div>
        </div>
        
        <button className="photo-btn animate-in delay-3">
          <span>📷</span>
          <span>Add photo (optional)</span>
        </button>
        
        <button 
          className="primary-button animate-in delay-4"
          disabled={!canEstimate}
          onClick={() => onEstimate(description, portion)}
        >
          Estimate item
        </button>
      </div>
      
      <style>{logStyles}</style>
    </div>
  );
};

const EstimateReviewScreen = ({ description, onConfirm, onEdit, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [estimate, setEstimate] = useState(null);
  const [rawNutrients, setRawNutrients] = useState({});
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const response = await fetch(`${window.API_BASE_URL || ''}/api/estimate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: description, item_type: 'meal' })
        });
        const data = await response.json();
        
        if (data.parsed_components) {
          setEstimate({
            components: data.parsed_components.map(c => ({
              name: c.food,
              amount: `~${c.amount} ${c.unit}`,
              cal: Math.round(data.nutrients.calories / data.parsed_components.length)
            })),
            totalCal: Math.round(data.nutrients.calories),
            confidence: data.confidence?.band || 'Medium'
          });
          setRawNutrients(data.nutrients || {});
        } else {
          // Fallback to mock data if API fails
          setEstimate({
            components: [{ name: 'Food item', amount: '~1 serving', cal: 300 }],
            totalCal: 300,
            confidence: 'Low'
          });
          setRawNutrients({ calories: 300 });
        }
      } catch (err) {
        console.error('Estimate error:', err);
        setEstimate({
          components: [{ name: 'Food item', amount: '~1 serving', cal: 300 }],
          totalCal: 300,
          confidence: 'Low'
        });
        setRawNutrients({ calories: 300 });
      }
      setIsLoading(false);
    };
    
    fetchEstimate();
  }, [description]);
  
  const handleConfirm = () => {
    onConfirm({
      name: estimate.components.map(c => c.name).join(' + '),
      calories: estimate.totalCal,
      nutrients: {
        protein: rawNutrients.protein || 0,
        fat: rawNutrients.fat || 0,
        fiber: rawNutrients.fiber || 0,
        omega3: rawNutrients.omega3 || 0,
        calcium: rawNutrients.calcium || 0
      },
      confidence: estimate.confidence.toLowerCase()
    });
  };
  
  if (isLoading) {
    return (
      <div className="screen loading-screen">
        <div className="loading-spinner"></div>
        <p className="loading-text">Estimating...</p>
        <style>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid #E8E4DC;
            border-top-color: #2D5A3D;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-text {
            font-size: 16px;
            color: #7A756E;
          }
        `}</style>
      </div>
    );
  }
  
  const confidenceColor = estimate.confidence === 'high' ? '#2D5A3D' : 
                          estimate.confidence === 'medium' ? '#D4A03D' : '#C45C3E';
  
  return (
    <div className="screen">
      <div className="top-bar">
        <button className="back-button" onClick={onBack}>←</button>
        <span className="top-bar-title">Review estimate</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="screen-content">
        <div className="estimate-header animate-in">
          <h1 className="screen-title">Here's our estimate</h1>
          <div className="confidence-pill">
            <span className="conf-dot" style={{ background: confidenceColor }}></span>
            {estimate.confidence} confidence
          </div>
        </div>
        
        <div className="original-text animate-in delay-1">
          <span className="original-label">You described:</span>
          <span className="original-value">"{description}"</span>
        </div>
        
        <div className="components-card animate-in delay-2">
          <h3 className="section-label">Likely components</h3>
          {estimate.components.map((comp, i) => (
            <div key={i} className="component-row">
              <div className="component-info">
                <span className="component-name">{comp.name}</span>
                <span className="component-amount">{comp.amount}</span>
              </div>
              <span className="component-cal">{comp.cal} kcal</span>
            </div>
          ))}
          <div className="total-row">
            <span>Estimated total</span>
            <span className="total-cal">{estimate.totalCal} kcal</span>
          </div>
        </div>
        
        <p className="disclaimer animate-in delay-3">This is an estimate. Adjust if needed.</p>
        
        <div className="button-row animate-in delay-4">
          <button className="secondary-button" onClick={onEdit}>Edit</button>
          <button className="primary-button" style={{ flex: 2 }} onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
      
      <style>{logStyles}</style>
    </div>
  );
};

const SuccessScreen = ({ onDone, onAddAnother }) => {
  return (
    <div className="screen success-screen">
      <div className="success-icon animate-in">✓</div>
      <h1 className="success-title animate-in delay-1">Item logged</h1>
      <p className="success-text animate-in delay-2">Your daily nutrition check has been updated</p>
      
      <div className="success-buttons animate-in delay-3">
        <button className="primary-button" onClick={onDone}>Done</button>
        <button className="secondary-button" onClick={onAddAnother}>Log another</button>
      </div>
      
      <style>{`
        .success-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 32px;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #2D5A3D;
          color: #FFFFFF;
          font-size: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .success-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 26px;
          font-weight: 500;
          color: #2D2A26;
          margin-bottom: 8px;
        }
        .success-text {
          font-size: 15px;
          color: #7A756E;
          margin-bottom: 40px;
        }
        .success-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 280px;
        }
      `}</style>
    </div>
  );
};

const logStyles = `
  .item-type-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  
  .item-type-card {
    background: #FFFFFF;
    border: 2px solid transparent;
    border-radius: 16px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(61, 58, 54, 0.06);
  }
  
  .item-type-card:hover {
    border-color: #2D5A3D;
    transform: translateY(-2px);
  }
  
  .item-type-icon { font-size: 36px; }
  .item-type-label {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 18px;
    font-weight: 500;
    color: #2D2A26;
  }
  .item-type-desc {
    font-size: 13px;
    color: #9A958E;
    text-align: center;
  }
  
  .method-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .method-card {
    background: #FFFFFF;
    border: 2px solid transparent;
    border-radius: 14px;
    padding: 18px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(61, 58, 54, 0.06);
    text-align: left;
    width: 100%;
  }
  
  .method-card:hover { border-color: #2D5A3D; }
  
  .method-icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
    background: #F5F2ED;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .method-content { flex: 1; }
  .method-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  .method-label {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 17px;
    font-weight: 500;
    color: #2D2A26;
  }
  .method-tag {
    font-size: 11px;
    font-weight: 600;
    color: #2D5A3D;
    background: rgba(45, 90, 61, 0.1);
    padding: 3px 8px;
    border-radius: 10px;
  }
  .method-desc { font-size: 14px; color: #7A756E; }
  .method-arrow { font-size: 18px; color: #B5B0A8; }
  
  .search-box {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #FFFFFF;
    border: 2px solid #E8E4DC;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 24px;
    transition: border-color 0.2s ease;
  }
  .search-box.focused { border-color: #2D5A3D; }
  .search-icon { font-size: 18px; opacity: 0.6; }
  .search-input {
    flex: 1;
    border: none;
    background: none;
    font-size: 16px;
    font-family: inherit;
    color: #3D3A36;
    outline: none;
  }
  .search-input::placeholder { color: #B5B0A8; }
  .clear-btn {
    background: #E8E4DC;
    border: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    font-size: 12px;
    color: #7A756E;
    cursor: pointer;
  }
  
  .product-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .product-card {
    background: #FFFFFF;
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(61, 58, 54, 0.05);
    text-align: left;
    width: 100%;
  }
  .product-card:hover { border-color: #2D5A3D; }
  .product-info { display: flex; flex-direction: column; gap: 3px; flex: 1; }
  .product-brand {
    font-size: 12px;
    color: #9A958E;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .product-name { font-size: 15px; font-weight: 500; color: #2D2A26; }
  .product-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  .product-cal {
    font-size: 13px;
    color: #7A756E;
  }
  .product-type-badge {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 3px 8px;
    border-radius: 6px;
  }
  .product-type-badge.ingredient {
    background: rgba(45, 90, 61, 0.1);
    color: #2D5A3D;
  }
  .product-type-badge.product {
    background: rgba(212, 160, 61, 0.15);
    color: #8B6914;
  }
  
  .loading-hint {
    font-size: 14px;
    color: #9A958E;
    text-align: center;
    padding: 12px 0;
  }
  
  .no-results {
    font-size: 14px;
    color: #9A958E;
    text-align: center;
    padding: 20px 0;
    font-style: italic;
  }
  
  .search-hint {
    margin-top: 24px;
    font-size: 14px;
    color: #7A756E;
    text-align: center;
  }
  .link-btn {
    background: none;
    border: none;
    color: #2D5A3D;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    font-size: inherit;
    font-family: inherit;
  }
  
  .selected-product {
    background: #FFFFFF;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 28px;
    box-shadow: 0 2px 6px rgba(61, 58, 54, 0.05);
  }
  .selected-brand {
    display: block;
    font-size: 12px;
    color: #9A958E;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  .selected-name {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 18px;
    font-weight: 500;
    color: #2D2A26;
  }
  
  .amount-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .amount-input {
    width: 80px;
    padding: 14px 16px;
    font-size: 24px;
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 500;
    text-align: center;
    border: 2px solid #E8E4DC;
    border-radius: 12px;
    background: #FFFFFF;
    color: #2D2A26;
    outline: none;
  }
  .amount-input:focus { border-color: #2D5A3D; }
  .unit-selector { display: flex; gap: 8px; flex-wrap: wrap; }
  .unit-btn {
    padding: 10px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 2px solid #E8E4DC;
    border-radius: 10px;
    background: #FFFFFF;
    color: #5C5852;
    cursor: pointer;
  }
  .unit-btn.active {
    border-color: #2D5A3D;
    background: rgba(45, 90, 61, 0.08);
    color: #2D5A3D;
    font-weight: 500;
  }
  
  .estimate-box {
    background: #F5F2ED;
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }
  .estimate-label { font-size: 14px; color: #7A756E; }
  .estimate-value {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 20px;
    font-weight: 500;
    color: #2D2A26;
  }
  
  .time-options { display: flex; gap: 10px; }
  .time-btn {
    padding: 10px 16px;
    font-size: 14px;
    font-family: inherit;
    border: 2px solid #E8E4DC;
    border-radius: 10px;
    background: #FFFFFF;
    color: #5C5852;
    cursor: pointer;
  }
  .time-btn.active {
    border-color: #2D5A3D;
    background: rgba(45, 90, 61, 0.08);
    color: #2D5A3D;
    font-weight: 500;
  }
  
  .describe-textarea {
    width: 100%;
    padding: 16px;
    font-size: 16px;
    font-family: inherit;
    border: 2px solid #E8E4DC;
    border-radius: 14px;
    background: #FFFFFF;
    color: #3D3A36;
    outline: none;
    resize: none;
    line-height: 1.5;
  }
  .describe-textarea:focus { border-color: #2D5A3D; }
  .describe-textarea::placeholder { color: #B5B0A8; }
  
  .portion-options { display: flex; gap: 10px; }
  .portion-btn {
    flex: 1;
    padding: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-family: inherit;
    font-size: 14px;
    text-transform: capitalize;
    border: 2px solid #E8E4DC;
    border-radius: 12px;
    background: #FFFFFF;
    color: #5C5852;
    cursor: pointer;
  }
  .portion-btn.active {
    border-color: #2D5A3D;
    background: rgba(45, 90, 61, 0.08);
    color: #2D5A3D;
  }
  .portion-icon { font-size: 20px; }
  
  .photo-btn {
    width: 100%;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 15px;
    font-family: inherit;
    color: #7A756E;
    border: 2px dashed #D4CFC4;
    border-radius: 12px;
    background: transparent;
    cursor: pointer;
    margin-bottom: 24px;
  }
  
  .estimate-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .confidence-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #EFEBE4;
    border-radius: 20px;
    font-size: 13px;
    color: #5C5852;
  }
  .conf-dot { width: 8px; height: 8px; border-radius: 50%; }
  
  .original-text {
    background: #F5F2ED;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 20px;
  }
  .original-label { display: block; font-size: 12px; color: #9A958E; margin-bottom: 4px; }
  .original-value { font-size: 15px; color: #3D3A36; font-style: italic; }
  
  .components-card {
    background: #FFFFFF;
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(61, 58, 54, 0.06);
  }
  .component-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #F5F2ED;
  }
  .component-info { display: flex; flex-direction: column; gap: 2px; }
  .component-name { font-size: 15px; color: #2D2A26; }
  .component-amount { font-size: 13px; color: #9A958E; }
  .component-cal { font-size: 14px; color: #5C5852; }
  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 14px;
    margin-top: 4px;
    font-weight: 500;
  }
  .total-cal {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 18px;
    color: #2D2A26;
  }
  
  .disclaimer {
    font-size: 13px;
    color: #9A958E;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .button-row {
    display: flex;
    gap: 12px;
  }
`;

// ============================================
// MAIN APP
// ============================================
function App() {
  // Load initial state from localStorage
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [profile, setProfile] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [todayLog, setTodayLog] = useState({ date: getTodayKey(), items: [], totalCalories: 0 });
  const [allLogs, setAllLogs] = useState({});
  
  // Log flow state
  const [logStep, setLogStep] = useState('itemType');
  const [itemType, setItemType] = useState(null);
  const [entryMethod, setEntryMethod] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [description, setDescription] = useState('');
  const [estimatedNutrients, setEstimatedNutrients] = useState(null);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = Storage.get(STORAGE_KEYS.PROFILE);
    const savedLogs = Storage.get(STORAGE_KEYS.DAILY_LOGS, {});
    const onboardingComplete = Storage.get(STORAGE_KEYS.ONBOARDING_COMPLETE, false);
    
    if (savedProfile) {
      setProfile(savedProfile);
    }
    
    setAllLogs(savedLogs);
    
    const today = getTodayKey();
    if (savedLogs[today]) {
      setTodayLog(savedLogs[today]);
    }
    
    // Skip to home if onboarding already done
    if (onboardingComplete && savedProfile) {
      setCurrentScreen('home');
    }
    
    setIsLoading(false);
  }, []);
  
  // Save profile whenever it changes
  useEffect(() => {
    if (profile) {
      Storage.set(STORAGE_KEYS.PROFILE, profile);
    }
  }, [profile]);
  
  // Save logs whenever they change
  useEffect(() => {
    if (Object.keys(allLogs).length > 0) {
      Storage.set(STORAGE_KEYS.DAILY_LOGS, allLogs);
    }
  }, [allLogs]);
  
  const resetLogFlow = () => {
    setLogStep('itemType');
    setItemType(null);
    setEntryMethod(null);
    setSelectedProduct(null);
    setDescription('');
    setEstimatedNutrients(null);
  };
  
  const handleProfileComplete = (p) => {
    setProfile(p);
    Storage.set(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
    setCurrentScreen('home');
  };
  
  const handleUpdateProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };
  
  const handleLogItem = () => {
    resetLogFlow();
    setCurrentScreen('log');
  };
  
  const handleLogComplete = (logData) => {
    const now = new Date();
    const defaultTime = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    const today = getTodayKey();
    
    // Create the new item with full nutrient data
    const newItem = {
      id: Date.now().toString(),
      time: logData?.time || defaultTime,
      type: itemType,
      name: selectedProduct ? selectedProduct.name : (logData?.name || description.slice(0, 40)),
      brand: selectedProduct?.brand || null,
      amount: logData?.amount || 1,
      unit: logData?.unit || 'serving',
      calories: logData?.calories || selectedProduct?.kcal_per_serving || 0,
      nutrients: logData?.nutrients || estimatedNutrients || {},
      confidence: logData?.confidence || (selectedProduct ? 'high' : 'medium'),
      source: selectedProduct ? 'database' : 'estimated'
    };
    
    // Update today's log
    const updatedTodayLog = {
      ...todayLog,
      items: [...todayLog.items, newItem],
      totalCalories: todayLog.totalCalories + (newItem.calories || 0)
    };
    
    setTodayLog(updatedTodayLog);
    
    // Update all logs
    const updatedAllLogs = {
      ...allLogs,
      [today]: updatedTodayLog
    };
    setAllLogs(updatedAllLogs);
    
    setLogStep('success');
  };
  
  const handleDeleteLogItem = (itemId) => {
    const today = getTodayKey();
    const itemToDelete = todayLog.items.find(item => item.id === itemId);
    
    if (!itemToDelete) return;
    
    const updatedTodayLog = {
      ...todayLog,
      items: todayLog.items.filter(item => item.id !== itemId),
      totalCalories: todayLog.totalCalories - (itemToDelete.calories || 0)
    };
    
    setTodayLog(updatedTodayLog);
    
    const updatedAllLogs = {
      ...allLogs,
      [today]: updatedTodayLog
    };
    setAllLogs(updatedAllLogs);
  };
  
  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setCurrentScreen('dayDetail');
  };
  
  const handleUseRoutine = (routine) => {
    const now = new Date();
    const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
    const today = getTodayKey();
    
    const newItems = routine.items.map(item => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      time,
      type: item.type,
      name: item.name,
      brand: item.brand || null,
      amount: item.amount || 1,
      unit: item.unit || 'serving',
      calories: item.calories || 0,
      nutrients: item.nutrients || {},
      confidence: 'high',
      source: 'routine'
    }));
    
    const addedCalories = newItems.reduce((sum, item) => sum + (item.calories || 0), 0);
    
    const updatedTodayLog = {
      ...todayLog,
      items: [...todayLog.items, ...newItems],
      totalCalories: todayLog.totalCalories + addedCalories
    };
    
    setTodayLog(updatedTodayLog);
    
    const updatedAllLogs = {
      ...allLogs,
      [today]: updatedTodayLog
    };
    setAllLogs(updatedAllLogs);
    
    setCurrentScreen('home');
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <style>{sharedStyles}</style>
        <div style={{ textAlign: 'center', color: '#7A756E' }}>Loading...</div>
      </div>
    );
  }
  
  // Render screens
  if (currentScreen === 'welcome') {
    return (
      <div className="app-container">
        <style>{sharedStyles}</style>
        <WelcomeScreen onGetStarted={() => setCurrentScreen('profile')} />
      </div>
    );
  }
  
  if (currentScreen === 'profile') {
    return (
      <div className="app-container">
        <style>{sharedStyles}</style>
        <ProfileSetupScreen onComplete={handleProfileComplete} />
      </div>
    );
  }
  
  if (currentScreen === 'home') {
    return (
      <div className="app-container">
        <style>{sharedStyles}</style>
        <HomeScreen 
          profile={profile}
          todayLog={todayLog}
          onLogItem={handleLogItem}
          onDeleteItem={handleDeleteLogItem}
          onViewHistory={() => setCurrentScreen('history')}
          onViewRoutines={() => setCurrentScreen('routines')}
          onViewProfile={() => setCurrentScreen('settings')}
        />
        <BottomNav 
          activeTab="home"
          onNavigate={setCurrentScreen}
          onLogItem={handleLogItem}
        />
      </div>
    );
  }
  
  if (currentScreen === 'history') {
    // Merge todayLog into allLogs for display
    const today = getTodayKey();
    const mergedLogs = { ...allLogs, [today]: todayLog };
    
    return (
      <div className="app-container">
        <style>{sharedStyles}</style>
        <HistoryScreen 
          allLogs={mergedLogs}
          onBack={() => setCurrentScreen('home')}
          onSelectDay={handleSelectDay}
        />
        <BottomNav 
          activeTab="history"
          onNavigate={setCurrentScreen}
          onLogItem={handleLogItem}
        />
      </div>
    );
  }
  
  if (currentScreen === 'dayDetail') {
    return (
      <div className="app-container">
        <style>{sharedStyles}</style>
        <DayDetailScreen 
          day={selectedDay}
          onBack={() => setCurrentScreen('history')}
          onEditEntry={(entry) => console.log('Edit entry:', entry)}
          onAddItem={handleLogItem}
        />
      </div>
    );
  }
  
  if (currentScreen === 'settings') {
    return (
      <div className="app-container">
        <style>{sharedStyles}</style>
        <ProfileSettingsScreen 
          profile={profile}
          onBack={() => setCurrentScreen('home')}
          onUpdateProfile={handleUpdateProfile}
        />
        <BottomNav 
          activeTab="settings"
          onNavigate={setCurrentScreen}
          onLogItem={handleLogItem}
        />
      </div>
    );
  }
  
  if (currentScreen === 'routines') {
    return (
      <div className="app-container">
        <style>{sharedStyles}</style>
        <RoutinesScreen 
          onBack={() => setCurrentScreen('home')}
          onUseRoutine={handleUseRoutine}
          onCreateRoutine={() => console.log('Create routine')}
        />
        <BottomNav 
          activeTab="routines"
          onNavigate={setCurrentScreen}
          onLogItem={handleLogItem}
        />
      </div>
    );
  }
  
  if (currentScreen === 'log') {
    return (
      <div className="app-container">
        <style>{sharedStyles}</style>
        
        {logStep === 'itemType' && (
          <ItemTypeScreen 
            onSelect={(type) => { setItemType(type); setLogStep('entryMethod'); }}
            onClose={() => setCurrentScreen('home')}
          />
        )}
        
        {logStep === 'entryMethod' && (
          <EntryMethodScreen 
            itemType={itemType}
            onSelect={(method) => { 
              setEntryMethod(method); 
              if (method === 'search') {
                setLogStep('productSearch');
              } else if (method === 'quick') {
                setLogStep('quickAdd');
              } else {
                setLogStep('describe');
              }
            }}
            onBack={() => setLogStep('itemType')}
          />
        )}
        
        {logStep === 'quickAdd' && (
          <QuickAddScreen 
            itemType={itemType}
            onSave={handleLogComplete}
            onBack={() => setLogStep('entryMethod')}
            onSearchInstead={() => setLogStep('productSearch')}
          />
        )}
        
        {logStep === 'productSearch' && (
          <ProductSearchScreen 
            onSelect={(product) => { setSelectedProduct(product); setLogStep('amount'); }}
            onBack={() => setLogStep('entryMethod')}
            onDescribe={() => setLogStep('describe')}
          />
        )}
        
        {logStep === 'amount' && (
          <AmountScreen 
            product={selectedProduct}
            onSave={handleLogComplete}
            onBack={() => setLogStep('productSearch')}
          />
        )}
        
        {logStep === 'describe' && (
          <DescribeScreen 
            onEstimate={(desc) => { setDescription(desc); setLogStep('estimateReview'); }}
            onBack={() => setLogStep('entryMethod')}
          />
        )}
        
        {logStep === 'estimateReview' && (
          <EstimateReviewScreen 
            description={description}
            onConfirm={handleLogComplete}
            onEdit={() => setLogStep('describe')}
            onBack={() => setLogStep('describe')}
          />
        )}
        
        {logStep === 'success' && (
          <SuccessScreen 
            onDone={() => setCurrentScreen('home')}
            onAddAnother={resetLogFlow}
          />
        )}
      </div>
    );
  }
  
  return null;
}
