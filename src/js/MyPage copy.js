// ... 기존 imports ...

// 기본 뱃지 데이터
const defaultBadges = [
    { 
        name: "진실 수호자",
        emoji: '🥇', 
        label: '진실 수호자', 
        description: "모든 가짜 뉴스를 완벽하게 구별했습니다!",
        gradient: 'yellow',
        active: false
    },
    { 
        name: "뉴스 탐정",
        emoji: '🔍', 
        label: '뉴스 탐정', 
        description: "뛰어난 판단력으로 가짜 뉴스를 구별했습니다!",
        gradient: 'blue',
        active: false
    },
    { 
        name: "요약의 달인",
        emoji: '⚖️', 
        label: '요약의 달인', 
        description: "뛰어난 요약 능력을 보여주셨습니다!",
        gradient: 'purple',
        active: false
    },
    { 
        name: "핵심 포착왕",
        emoji: '🎯', 
        label: '핵심 포착왕', 
        description: "뉴스의 핵심을 잘 파악하셨습니다!",
        gradient: 'green',
        active: false
    }
];

const MyPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        joinDate: '',
        totalGames: 0,
        bestScore: 0
    });
    const [badges, setBadges] = useState(defaultBadges);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        // 사용자 데이터 로드
        const userDataStr = localStorage.getItem('currentUser');
        if (userDataStr) {
            const user = JSON.parse(userDataStr);
            setUserData({
                username: user.username,
                email: user.email,
                school: user.school,
                joinDate: user.joinDate,
                totalGames: user.totalGames,
                bestScore: user.bestScore
            });
            setEditedData({
                username: user.username,
                email: user.email,
                school: user.school
            });
        }

        // 획득한 뱃지 로드
        const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
        const updatedBadges = defaultBadges.map(badge => ({
            ...badge,
            active: earnedBadges.some(earned => earned.name === badge.name)
        }));
        setBadges(updatedBadges);
    }, []);

    // ... 기존 코드 ...

    return (
        <>
        <Header />
        <div className="mypage-container">
            {/* ... 기존 코드 ... */}

            <div className="badge-section card">
                <h2>내 뱃지</h2>
                <div className="badge-grid">
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className={`badge-box ${badge.active ? `badge-gradient-${badge.gradient}` : 'badge-inactive'}`}
                            title={badge.description}
                        >
                            <div className="badge-emoji">{badge.emoji}</div>
                            <div className="badge-label">{badge.label}</div>
                            {badge.active && <div className="badge-description">{badge.description}</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* ... 기존 코드 ... */}
        </div>
        <Footer />
        </>
    );
};

export default MyPage;
