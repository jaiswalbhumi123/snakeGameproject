-- SnakesAndLadders नाम का डेटाबेस बनाएँ
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SnakesAndLadders')
BEGIN
    CREATE DATABASE SnakesAndLadders;
END;
GO

-- इस डेटाबेस का उपयोग करें
USE SnakesAndLadders;
GO

-- Players टेबल बनाएँ
-- यह खिलाड़ियों की जानकारी (नाम, इमेज, AI है या नहीं) स्टोर करेगी।
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Players')
BEGIN
    CREATE TABLE Players (
        PlayerId INT PRIMARY KEY IDENTITY(1,1),
        PlayerName NVARCHAR(100) NOT NULL,
        ProfileImage INT NOT NULL,
        IsAI BIT NOT NULL,
        Wins INT NOT NULL DEFAULT 0,
        Losses INT NOT NULL DEFAULT 0
    );
END;
GO

-- Games टेबल बनाएँ
-- यह हर गेम सेशन का रिकॉर्ड रखेगी।
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Games')
BEGIN
    CREATE TABLE Games (
        GameId INT PRIMARY KEY IDENTITY(1,1),
        GameDateTime DATETIME NOT NULL DEFAULT GETDATE(),
        GameLevel NVARCHAR(50) NOT NULL
    );
END;
GO

-- GameResults टेबल बनाएँ
-- यह हर गेम में खिलाड़ियों के अंतिम स्कोर और रैंक को स्टोर करेगी।
-- यह Games और Players टेबल से जुड़ी होगी।
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GameResults')
BEGIN
    CREATE TABLE GameResults (
        ResultId INT PRIMARY KEY IDENTITY(1,1),
        GameId INT NOT NULL,
        PlayerId INT NOT NULL,
        FinalScore INT NOT NULL,
        FinalRank INT NOT NULL,
        CONSTRAINT FK_GameId FOREIGN KEY (GameId) REFERENCES Games(GameId),
        CONSTRAINT FK_PlayerId FOREIGN KEY (PlayerId) REFERENCES Players(PlayerId)
    );
END;
GO