export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "It's 11:00AM on Sunday, what are you up to?",
    image: "image1.png",
    answers: [
      {
        text: "Texting friends to plan a brunch",
        scores: { E: 1 },
      },
      {
        text: "Enjoying a slow morning with coffee or tea and quiet time",
        scores: { I: 1, N: 1 },
      },
      {
        text: "Still in bed, scrolling aimlessly on social media",
        scores: { P: 1 },
      },
      {
        text: "Planning the week ahead, maybe making a todo list",
        scores: { J: 1, S: 1 },
      },
    ],
  },
  {
    id: 2,
    question: "Your friend had a bad day. How do you cheer them up?",
    image: "image2.png",
    answers: [
      {
        text: "Offer a logical solution or give advice to solve their problem",
        scores: { T: 1, S: 1 },
      },
      {
        text: "Let them rant and listen empathetically and offer emotional support",
        scores: { F: 1 },
      },
      {
        text: "Distract them with something fun and spontaneous",
        scores: { E: 1, P: 1 },
      },
      {
        text: "Give them space and check in later",
        scores: { I: 1, T: 1 },
      },
    ],
  },
  {
    id: 3,
    question: "What's your love language?",
    image: "image3.png",
    answers: [
      {
        text: "Quality time. I like being fully present",
        scores: { E: 1 },
      },
      {
        text: "Words of affirmation. I like expressing support and care for the people around me",
        scores: { F: 1 },
      },
      {
        text: "Acts of service. I like to help where I can, big or small",
        scores: { J: 1, E: 1 },
      },
      {
        text: "Giving gifts. I like seeing something and thinking of someone",
        scores: { N: 1 },
      },
    ],
  },
  {
    id: 4,
    question: "Which cozy scene best suits you?",
    image: "image4.png",
    answers: [
      {
        text: "Exploring a new cafe or neighborhood and wandering the city",
        scores: { P: 1 },
      },
      {
        text: "Organizing your space with your favorite playlist playing",
        scores: { J: 1, I: 1 },
      },
      {
        text: "Game night and chatting with friends",
        scores: { E: 1, F: 1 },
      },
      {
        text: "Reading at home while it rains",
        scores: { I: 1, N: 1 },
      },
    ],
  },
  {
    id: 5,
    question:
      "You and your friend are in a fight. How do you resolve this conflict?",
    image: "image5.png",
    answers: [
      {
        text: "Stay calm and talk through it",
        scores: { T: 1, S: 1 },
      },
      {
        text: "I'm too emotional and angry to handle my emotions",
        scores: { F: 1 },
      },
      {
        text: "Apologize first just to move on",
        scores: { T: 1 },
      },
      {
        text: "Give it time, think it through, and revisit later when things are less heated",
        scores: { T: 1, I: 1 },
      },
    ],
  },
  {
    id: 6,
    question: "Your best friend is heartbroken. What's your instinct?",
    image: "image6.png",
    answers: [
      {
        text: "Bring snacks and comfort them",
        scores: { F: 1 },
      },
      {
        text: "Get them outside for something distracting",
        scores: { F: 1 },
      },
      {
        text: "Send a thoughtful message",
        scores: { F: 1 },
      },
      {
        text: "Remind them of what's real and what they deserve",
        scores: { S: 1 },
      },
    ],
  },
  {
    id: 7,
    question: "When you like someone or meet someone new, how do you show it?",
    image: "image7.png",
    answers: [
      {
        text: "I talk to them a lot and try and make them laugh",
        scores: { E: 1, N: 1 },
      },
      {
        text: "I take note of details and show care and my thoughtfulness subtly",
        scores: { S: 1 },
      },
      {
        text: "I go with the flow, things will unfold however they are meant to",
        scores: { P: 1 },
      },
      {
        text: "I make a plan to spend time with them or find small ways to connect",
        scores: { J: 1 },
      },
    ],
  },
  {
    id: 8,
    question: "How would your friends describe you?",
    image: "image8.png",
    answers: [
      {
        text: "Outgoing and full of ideas",
        scores: { E: 1, N: 1 },
      },
      {
        text: "Calm, observant and thoughtful",
        scores: { I: 1, T: 1 },
      },
      {
        text: "Reliable and well organized",
        scores: { J: 1, T: 1 },
      },
      {
        text: "Laid back and adaptable",
        scores: { P: 1, N: 1 },
      },
    ],
  },
  {
    id: 9,
    question: "What music matches your vibe the most?",
    image: "image9.png",
    answers: [
      {
        text: "Upbeat and fun",
        scores: { E: 1 },
      },
      {
        text: "Chill and atmospheric",
        scores: { I: 1, N: 1 },
      },
      {
        text: "I listen to anything",
        scores: { P: 1 },
      },
      {
        text: "Something that fits the mood or activity I'm doing",
        scores: { S: 1 },
      },
    ],
  },
  {
    id: 10,
    question: "You're feeling sad. What cheers you up the most?",
    image: "image10.png",
    answers: [
      {
        text: "Being around people who make me smile",
        scores: { E: 1, F: 1 },
      },
      {
        text: "Alone time to reset and process",
        scores: { I: 1, T: 1 },
      },
      {
        text: "Doing something practical to get my mind off of things",
        scores: { J: 1, T: 1 },
      },
      {
        text: "Doing something creative and spontaneous to get my mind off things",
        scores: { P: 1, F: 1 },
      },
    ],
  },
  {
    id: 11,
    question: "When in a social gathering, you're usually...",
    image: "image11.png",
    answers: [
      {
        text: "Starting conversations and mingling easily",
        scores: { E: 1 },
      },
      {
        text: "Sticking with familiar faces but having meaningful chats",
        scores: { I: 1 },
      },
      {
        text: "Hosting and helping things run smoothly and organizing activities",
        scores: { J: 1 },
      },
      {
        text: "Floating around and following the fun",
        scores: { P: 1 },
      },
    ],
  },
  {
    id: 12,
    question: "When planning a trip, you prefer...",
    image: "image12.png",
    answers: [
      {
        text: "having a detailed itinerary with everything scheduled",
        scores: { J: 1 },
      },
      {
        text: "being spontaneous and seeing where the journey takes you",
        scores: { P: 1 },
      },
      {
        text: "Visiting historical landmarks and tourist destinations",
        scores: { S: 1 },
      },
      {
        text: "Discovering hidden gems and unique experiences",
        scores: { N: 1 },
      },
    ],
  },
  {
    id: 13,
    question: "In your daily life, you tend to be more...",
    image: "image13.png",
    answers: [
      {
        text: "outgoing and expressive, always open to share your thoughts with others",
        scores: { E: 1 },
      },
      {
        text: "reserved and quiet, keeping thoughts to yourself",
        scores: { I: 1 },
      },
      {
        text: "observant of details and focused on the present moment",
        scores: { S: 1 },
      },
      {
        text: "imaginative and focused on the future",
        scores: { N: 1 },
      },
    ],
  },
  {
    id: 14,
    question: "How are you working on a team?",
    image: "image14.png",
    answers: [
      {
        text: "I take charge and organize tasks for the group",
        scores: { J: 1 },
      },
      {
        text: "I adapt to the team's flow and contribute as needed",
        scores: { P: 1 },
      },
      {
        text: "I want everyone to be comfortable and to make sure the team works harmoniously",
        scores: { F: 1 },
      },
      {
        text: "I focus on the most efficient way to finish the project",
        scores: { T: 1 },
      },
    ],
  },
  {
    id: 15,
    question: "You have to learn a new skill or finish a project.",
    image: "image15.png",
    answers: [
      {
        text: "I immediately jump in and start doing, learning by trial and error",
        scores: { E: 1 },
      },
      {
        text: "I read the instructions and gather information before starting",
        scores: { I: 1 },
      },
      {
        text: "I follow tutorials and step-by-step guides",
        scores: { S: 1 },
      },
      {
        text: "I explore different theories and conceptual ideas before getting started",
        scores: { N: 1 },
      },
    ],
  },
];

export const RESULT_OPTIONS = {
  E: {
    label: "Extraversion",
    description:
      "You love connecting with others. Your energy flows when you are surrounded by other people and you enjoy being in environments filled with laughter and good energy. You recharge with others. The world is your oyster and you are happiest when you are apart of the action.",
  },
  I: {
    label: "Introversion",
    description:
      "Your inner world is profound. You are full of thoughts. feelings and imagination. You prefer the quiet moments over noise, and the soluitute doesn't drain you. You may notice small things others might miss. You value moments of calm and reflection.",
  },
  S: {
    label: "Sensing",
    description:
      "You are grounded and observant. You trust what you can see, touch, and experience. You have been described as detail-oriented and practical. You find comfort with the real and the familiar. You like working with tangile things. ",
  },
  N: {
    label: "Intuition",
    description:
      "Your head is 'in the clouds'. You see possibilities everywhere, connecting ideas other might not even notice. You think large and you dream boldy. You look beyond 'what is' and imagine 'what could be'.  ",
  },
  T: {
    label: "Thinking",
    description:
      "You value clarity, fairness, and logic. When things get emotional, you are the cool head of the situation. You can untangle a mess with reason and precision. You care deeply, and it manifests by solving and fixing rather than comfort. You are a truth seeker who may sometimes have a heart of steel.",
  },
  F: {
    label: "Feeling",
    description:
      "Your emotional compass points towards feelings. You look to people and values and make decisions with emapthy and intuition. You do what feels right. Harmony matters a lot to you, because you care about how others feel. Your kindness is unmatched. ",
  },
  J: {
    label: "Judging",
    description:
      "You enjoy a clear plan and a decisive list. There is a satisfaction you feel when checking things off a list. Structure helps you breathe, it helps you make sense of a busy world. You have been described as dependable, organized, and future oriented. You also appreciate when your effort brings a little bit of peace to others.",
  },
  P: {
    label: "Perceiving",
    description:
      "You go with the flow. You are curious. You are always ready for the next adventure. You prefer spontaneity over stringent schedules. You like a variety of options over conclusions. You like to keep things fresh, fun, and full of surprises. ",
  },
};

export const MBTI_TYPES = {
  ISTJ: {
    label: "Tottenham Hotspur",
    compatible: "ISTP, 70%",
    incompatible: "ENFP, 18%",
    image: "ISTJ.png",
    pros: "You’re a down to earth sort of person. People can rely and trust your character.",
    cons: "You are no Dominik Szoboszlai. Sorry.",
    fact: "Most men are this MBTI type. Like Sting!",
  },

  ISFJ: {
    label: "Frankenstein’s Monster",
    compatible: "INFJ, 85%",
    incompatible: "ENFP, 12%",
    image: "ISFJ.png",
    pros: "You’re misunderstood! You care deeply and protect those you love. You might take it too far sometimes…",
    cons: "You need to go to therapy and stop repressing your feelings. It’s tiresome for everyone involved.",
    fact: "You are the most common MBTI type.",
  },

  INFJ: {
    label: "Orcchiette",
    compatible: "INFJ, 86%",
    incompatible: "ESTP, 5%",
    image: "INFJ.png",
    pros: "Translating to “Little Ear”, you are potentially very awesome. Keep posting those Instagram stories about social justice!",
    cons: "I know you’re trying, but you really need to commit to your Amazon boycott.",
    fact: "You are the rarest MBTI type. And Aragorn is an INFJ. Soooooo.",
  },

  INTJ: {
    label: "Victor Frankenstein",
    compatible: "INTP, 89%",
    incompatible: "ESFP, 22%",
    image: "INTJ.png",
    pros: "You’re smart, and love to work out an out-of-the-box solution.",
    cons: "You probably should work on your emotional intelligence!",
    fact: "You share an MBTI type with Elon Musk. Take that as you will.",
  },

  ISTP: {
    label: "Addison Rae’s Self-Titled Album “Addison”",
    compatible: "ISTJ, 62%",
    incompatible: "ENFJ, 9%",
    image: "ISTP.png",
    pros: "You could probably make an awesome table if you wanted to. And tell everyone you know.",
    cons: "Was your Spotify Wrapped Top Artists all men?",
    fact: "Indiana Jones is an ISTP! Is it time for a career switch to archaeology?",
  },

  ISFP: {
    label: "Mrs. Dalloway",
    compatible: "ISFJ, 76%",
    incompatible: "ENTJ, 6%",
    image: "ISFP.png",
    pros: "You are an extremely charming individual. Your kindness and sensitivity probably mean more to others than you realize!",
    cons: "I’m trusting you know who Virginia Woolf is. If not, pick up a book. Also, you might have low self esteem. Hard to hear. Sorry.",
    fact: "Prince was an ISFP #goated.",
  },

  INFP: {
    label: "HR",
    compatible: "INFJ, 85%",
    incompatible: "ESTJ, 14%",
    image: "INFP.png",
    pros: "You have a planner.",
    cons: "You NEED to get out of the situationship you’re most likely in right now. They’re not texting you because they don’t actually like you. Trust me!",
    fact: "Fred Rogers (Mr. Rogers) was an INFP. This is a super green flag for you.",
  },

  INTP: {
    label: "Borscht",
    compatible: "ENTJ, 96%",
    incompatible: "ESFJ, 39%",
    image: "INTP.png",
    pros: "You are unique I suppose.",
    cons: "You are so avoidantly attached it’s a little crazy.",
    fact: "Kafka was an INTP–shall we read “The Metamorphosis” and reflect?",
  },

  ESTP: {
    label: "Aron Ralston (Derogatory)",
    compatible: "ISTP, 62%",
    incompatible: "INFJ, 5%",
    image: "ESTP.png",
    pros: "Ugh.",
    cons: "You need to go to the dentist twice a year, seriously.",
    fact: "You can come back from this. Megan Thee Stallion is an ESTP and look at her!",
  },

  ESFP: {
    label: "Labubu",
    compatible: "ENFP, 93%",
    incompatible: "INTJ, 22%",
    image: "ESFP.png",
    pros: "I’m having a hard time finding a pro!",
    cons: "Do you find that other cars try to avoid being close to yours on the freeway?",
    fact: "You share an MBTI type with Peregrin Took. It’s good to share characteristics with that wee Hobbit.",
  },

  ENFP: {
    label: "Spix’s Macaw",
    compatible: "ENTJ, 97%",
    incompatible: "ISTP, 14%",
    image: "ENFP.png",
    pros: "You’ve got a “zest for life” apparently.",
    cons: "You should probably plan for the future a bit more. That 401K isn’t gonna happen by itself. Were you babied for a while by your parents?",
    fact: "You are totally a Carrie!",
  },

  ENTP: {
    label: "Dogberry",
    compatible: "ENFP, 94%",
    incompatible: "ISTJ, 11%",
    image: "ENTP.png",
    pros: "You’re creative! You’re not meant for a desk job. Get out there and create!",
    cons: "You might have been more annoying than you hoped in Socratic Seminars in high school.",
    fact: "Niccolo Machiavelli was an ENTP too. I’m wondering: is it better to be feared or loved?",
  },

  ESTJ: {
    label: "Karen I Guess",
    compatible: "ISTJ, 79%",
    incompatible: "INFP, 14%",
    image: "ESTJ.png",
    pros: "You are sooooo organized.",
    cons: "You might be overly concerned with others’ opinions of you. Have you seen the shows “I Love LA” or “Entourage”?",
    fact: "You are more likely to be the Break-Up-er than the Break-Up-ee.",
  },

  ESFJ: {
    label: "T Chalamet’s Portrayal of Willy Wonka (2023)",
    compatible: "ENFP, 93%",
    incompatible: "ISTP, 19%",
    image: "ESFJ.png",
    pros: "You probably were permanently affected by Sally Rooney’s “Normal People”.",
    cons: "Apparently you’re too needy. LOL!",
    fact: "It’s uncommon for ESFJs to work in tech. You would maybe make a great teacher.",
  },

  ENFJ: {
    label: "Carlsberg Lager",
    compatible: "ENFP, 91%",
    incompatible: "ISTP, 9%",
    image: "ENFJ.png",
    pros: "You think you’re that girl and you are!",
    cons: "In spite of being that girl, humility goes a long way. Let’s find it!",
    fact: "Elizabeth Bennet is an ENFJ. Is it time to rewatch Pride and Prejudice?",
  },

  ENTJ: {
    label: "O’ Captain My Captain",
    compatible: "INTJ, 97%",
    incompatible: "INFP, 24%",
    image: "ENTJ.png",
    pros: "You probably loved Good Will Hunting.",
    cons: "It’s time to dig deep: Do you unconsciously promote the agenda of a patriarchal society?",
    fact: "Tony Soprano was an ENTJ. What do you think happened in the diner at the end of that show?",
  },
};
