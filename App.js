//App.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView, SafeAreaView, Dimensions, Linking, TextInput, Alert, Platform, Modal, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icons from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';

function HomeScreen({ navigation }) {
    return (
        <View style={styles.landing}>
            <View style={styles.landingpageboxes}>
                <TouchableOpacity style={styles.landingsmallbox} onPress={() => navigation.navigate('TRSubjects')}>
                    <ImageBackground source={require('./assets/tr.png')} style={styles.landingimageBackground}>
                        <View style={styles.overlay} />
                        <Text style={styles.landingboxText}>TR            QUESTIONS</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={styles.landingsmallbox} onPress={() => navigation.navigate('HRQuestions')}>
                    <ImageBackground source={require('./assets/hr.png')} style={styles.landingimageBackground}>
                        <View style={styles.overlay} />
                        <Text style={styles.landingboxText}>HR            QUESTIONS</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
            <View style={styles.landingpageboxes}>
                <TouchableOpacity style={styles.landingsmallbox} onPress={() => navigation.navigate('MCQSubjects')}>
                    <ImageBackground source={require('./assets/mcq.png')} style={styles.landingimageBackground}>
                        <View style={styles.overlay} />
                        <Text style={styles.landingboxText}>MCQ PRACTICE QUESTIONS</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity style={styles.landingsmallbox} onPress={() => navigation.navigate('MockInterviews')}>
                    <ImageBackground source={require('./assets/mock.png')} style={styles.landingimageBackground}>
                        <View style={styles.overlay} />
                        <Text style={styles.landingboxText}>MOCK    INTERVIEWS</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.landingwidebox} onPress={() => navigation.navigate('WorkshopAreas')}>
                <ImageBackground source={require('./assets/workshop.jpg')} style={styles.landingimageBackground}>
                    <View style={styles.overlay} />
                    <Text style={styles.landingboxText}>WORKSHOP                                                    AREA</Text>
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
};

const decodeBase64 = (base64String) => {
  return `data:image/jpeg;base64,${base64String}`;
};

const TRSubjects = ({ navigation }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/subjects/getsubjects');
      setSubjects(response.data);
      console.log(subjects)
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const renderTRSubjectsInRows = () => {
    const rows = [];
    for (let i = 0; i < subjects.length; i += 2) {
      const firstSubject = subjects[i];
      const secondSubject = subjects[i + 1];
      rows.push(
        <View key={i} style={styles.subjectRow}>
          <TouchableOpacity
            style={styles.subjectItemWrapper}
            onPress={() => navigation.navigate('TRQuestions', { subjectName: firstSubject.subjectName })}
          >
            <View style={styles.subjectItem}>
              <Image style={styles.subjectIcon} source={{ uri: decodeBase64(firstSubject.subjectIcon) }} />
              <Text style={styles.subjectName}>{firstSubject.subjectName}</Text>
            </View>
          </TouchableOpacity>
          {secondSubject && (
            <TouchableOpacity
              style={styles.subjectItemWrapper}
              onPress={() => navigation.navigate('TRQuestions', { subjectName: secondSubject.subjectName })}
            >
              <View style={styles.subjectItem}>
                <Image style={styles.subjectIcon} source={{ uri: decodeBase64(secondSubject.subjectIcon) }} />
                <Text style={styles.subjectName}>{secondSubject.subjectName}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.subjectcontainer}>
      <View style={styles.subjectbackground} />
      <View style={styles.subjectContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {subjects.length > 0 ? (
            renderTRSubjectsInRows()
          ) : (
            <Text style={styles.noSubjectsText}>No subjects available</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const TRQuestions = ({ route, navigation }) => {
    const [data, setData] = useState([]);
    const { subjectName } = route.params;
  
    useEffect(() => {
      async function fetchData() {
        try {
          const questionsResponse = await axios.get('http://localhost/trquestions/get');
          const filteredQuestions = questionsResponse.data.filter(question =>
            question.option === subjectName
          );
          setData(filteredQuestions);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData();
    }, [subjectName]);
  
    return (
      <View style={styles.trcontainer}>
        <View style={styles.subjectContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.questionsContainer}>
              {data.map((item, index) => (
                <Question key={index} question={item.question} answer={item.answer} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  
  const Question = ({ question, answer }) => {
    const [isPressed, setIsPressed] = useState(false);
  
    return (
      <View style={styles.containerquestion}>
        <TouchableOpacity onPress={() => setIsPressed(!isPressed)}>
          <View style={[styles.questionbox, isPressed && styles.questionboxPressed]}>
            <Text style={styles.questionText}>Question:</Text>
            <Text style={styles.textquestion}>{question}</Text>
            {isPressed && (
              <View style={styles.answerbox}>
              <View style={styles.linetr} />
                <Text style={styles.answerText}>Answer:</Text>
                <Text>{answer}</Text>
                </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

const HRQuestions = ({ route, navigation }) => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
      async function fetchData() {
        try {
          const questionsResponse = await axios.get('http://localhost:8080/api/hrQuestions/getHrQuestions');
          setData(questionsResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData();
    }, []);
  
    return (
      <View style={styles.trcontainer}>
        <View style={styles.subjectContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.questionsContainer}>
              {data.map((item, index) => (
                <Questions key={index} question={item.question} answer={item.answer} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  
const Questions = ({ question, answer }) => {
    const [isPressed, setIsPressed] = useState(false);
  
    return (
      <View style={styles.containerquestion}>
        <TouchableOpacity onPress={() => setIsPressed(!isPressed)}>
          <View style={[styles.questionbox, isPressed && styles.questionboxPressed]}>
            <Text style={styles.questionText}>Question:</Text>
            <Text style={styles.textquestion}>{question}</Text>
            {isPressed && (
              <View style={styles.answerbox}>
                <View style={styles.linetr} />
                <Text style={styles.answerText}>Answer:</Text>
                <Text>{answer}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
}; 

const MCQSubjects = ({ navigation }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/subjects/getsubjects');
      setSubjects(response.data);
      console.log(subjects)
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };
  const renderMCQSubjectsInRows = () => {
    const rows = [];
    for (let i = 0; i < subjects.length; i += 2) {
      const firstSubject = subjects[i];
      const secondSubject = subjects[i + 1];
      rows.push(
        <View key={i} style={styles.subjectRow}>
          <TouchableOpacity
            style={styles.subjectItemWrapper}
            onPress={() => navigation.navigate('MCQPracticeQuestions', { subjectName: firstSubject.subjectName.toLowerCase()})}
          >
            <View style={styles.subjectItem}>
              <Image style={styles.subjectIcon} source={{ uri: decodeBase64(firstSubject.subjectIcon) }} />
              <Text style={styles.subjectName}>{firstSubject.subjectName}</Text>
            </View>
          </TouchableOpacity>
          {secondSubject && (
            <TouchableOpacity
              style={styles.subjectItemWrapper}
              onPress={() => navigation.navigate('MCQPracticeQuestions', { subjectName: secondSubject.subjectName.toLowerCase() })}
            >
              <View style={styles.subjectItem}>
                <Image style={styles.subjectIcon} source={{ uri: decodeBase64(secondSubject.subjectIcon) }} />
                <Text style={styles.subjectName}>{secondSubject.subjectName}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.subjectcontainer}>
      <View style={styles.subjectbackground} />
      <View style={styles.subjectContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {subjects.length > 0 ? (
            renderMCQSubjectsInRows()
          ) : (
            <Text style={styles.noSubjectsText}>No subjects available</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};



const MCQPracticeQuestions = ({ route }) => {
  const { subjectName } = route.params;
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/mcq/questions?subject=${subjectName}`);
      setQuestions(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: option,
    });

    const correctAnswer = questions[questionIndex].answer;
    if (option === correctAnswer) {
      setFeedback({
        ...feedback,
        [questionIndex]: "Correct!",
      });
    } else {
      setFeedback({
        ...feedback,
        [questionIndex]: `Incorrect. Explanation: ${questions[questionIndex].explanation}`,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{subjectName} Questions</Text>
      {error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            {['option1', 'option2', 'option3', 'option4'].map((optionKey) => (
              <TouchableOpacity
                key={optionKey}
                style={[
                  styles.optionButton,
                  selectedOptions[index] === optionKey && (
                    questions[index].answer === optionKey
                      ? styles.correctOptionButton
                      : styles.incorrectOptionButton
                  ),
                ]}
                onPress={() => handleOptionSelect(index, optionKey)}
              >
                <Text style={styles.optionText}>
                  {optionKey === 'option1' ? 'A' :
                  optionKey === 'option2' ? 'B' :
                  optionKey === 'option3' ? 'C' : 'D'}. {question[optionKey]}
                </Text>
              </TouchableOpacity>
            ))}
            {feedback[index] && <Text style={styles.feedbackText}>{feedback[index]}</Text>}
          </View>
        ))
      )}
    </ScrollView>
  );
};



const MockInterviews = () => (
    <View style={styles.centeredView}>
        <Text>Mock Interviews Page</Text>
    </View>
);

const WorkshopAreas = () => {
    const navigation = useNavigation();

    return (
        <ImageBackground
          source={require('./assets/bg.png')}
          style={styles.workbackground}
        >
          <View style={styles.works}>
            <View style={styles.workcontainer}>
              <TouchableOpacity style={[styles.workbutton, styles.pollButton]} onPress={() => navigation.navigate('PollDivision')}>
                <View style={styles.workimageWrapper}>
                  <ImageBackground
                    source={require('./assets/poll.png')}
                    style={styles.buttonImage}
                    imageStyle={styles.imageStyle}
                  />
                  <View style={styles.workoverlay}>
                    <Text style={styles.workText}>POLL                   DIVISION</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.workbutton, styles.ceButton]} onPress={() => navigation.navigate('CodingEnvironment')}>
                <View style={styles.workimageWrapper}>
                  <ImageBackground
                    source={require('./assets/code1.png')}
                    style={styles.buttonImage}
                    imageStyle={styles.imageStyle}
                  />
                  <View style={styles.workoverlay}>
                    <Text style={styles.workText}>CODING  ENVIRONMENT</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      );
};

const PollDivision = () => (
    <View style={styles.centeredView}>
        <Text>Poll Division Page</Text>
    </View>
);

const CodingEnvironment = () => (
    <View style={styles.centeredView}>
        <Text>Coding Environment Page</Text>
    </View>
);

const Notifications = () => (
    <View style={styles.centeredView}>
        <Text>Notifications Page</Text>
    </View>
);

const FAQItem = ({ question, answer, index, expandedIndex, setExpandedIndex }) => {

    const toggleExpansion = () => {
      setExpandedIndex(index === expandedIndex ? null : index);
    };
  
    return (
      <View style={[styles.faqitemcontainer, expandedIndex === index ? styles.faqitemexpandedContainer : null]}>
        <TouchableOpacity onPress={toggleExpansion} style={styles.faqitemquestionContainer}>
          <Text style={styles.faqitemquestion}>{question}</Text>
        </TouchableOpacity>
  
        {expandedIndex === index && (
          <View style={styles.faqitemanswerContainer}>
            <View style={styles.faqitemline} />
            <Text style={styles.faqitemanswer}>{answer}</Text>
          </View>
        )}
      </View>
    );
  };
  
  
  const { width: windowWidths } = Dimensions.get('window');
  
  const questionBoxWidth = windowWidths * 0.9;
  
  const FAQScreen = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);
  
    return (
      <SafeAreaView style={styles.faqcontainer}>
        <ScrollView contentContainerStyle={styles.faqscrollViewContent}>
          <Text style={styles.faqText}>Frequently Asked Questions</Text>
          <View style={styles.faqimageContainer}>
            <Image
              source={require('./assets/underline.png')}
              style={styles.faqunderlineImage}
            />
          </View>
          
          
          <FAQItem
            question="Curriculum Overview"
            answer="We provide a full 360 degree course where the curriculum being split into Basic(Theory + Competitive Coding), Cognitive and Advanced Technical to help you crack any MNC with ease."
            index={0}
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
          />
          <FAQItem
            question="What is Java?"
            answer="Platform Independence: Java programs are typically compiled to bytecode, which can be executed on any Java Virtual Machine (JVM), making Java platform-independent."
            index={1}
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
          />
          <FAQItem
            question="Tell us about Assignments?"
            answer="Daily Assignment tasks are given to students because practice is the key. It would consist of both MCQs and Coding Questions which are expected to be practiced and solved by students, at which you will excel on being consistent. For better clarifications, Recorded solutions of the same are made available."
            index={2}
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
          />
          {/* Add more FAQ items as needed */}
        </ScrollView>
      </SafeAreaView>
    );
  };

  const BlogScreen = () => {
    const [loading, setLoading] = useState(true);
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
  
        {loading && (
          <View style={styles.blogsloadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <WebView
          source={{ uri: 'https://bodhasoft.com/blogs' }}
          onLoadEnd={() => setLoading(false)}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  };

  const ProfileCard = ({ name, role, imageSource, companyLogo, paragraph }) => {
    const [rating, setRating] = useState(5);
  
    const handleStarClick = (index) => {
      setRating(index + 1);
    };
  
    return (
      <View style={styles.Profilecontainer}>
        {/* Left content */}
        <View style={styles.profileleftContent}>
          <Image source={imageSource} style={styles.profileimage} />
          <View style={styles.profilecompanyContainer}>
            <Text style={styles.placedInText}>Placed in</Text>
            <Image source={companyLogo} style={styles.profilecompanyLogo} />
          </View>
        </View>
  
        {/* Right content */}
        <View style={styles.profilerightContent}>
          <Text style={styles.alumniname}>{name}</Text>
          <Text style={styles.alumnirole}>{role}</Text>
  
          {/* Star rating */}
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleStarClick(index)}>
                <Text style={[styles.star, index < rating ? styles.selectedStar : null]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
  
          {/* Alumni paragraph */}
          <Text style={styles.Alumniparagraph}>{paragraph}</Text>
        </View>
      </View>
    );
  };
  
  const PlacementScreen = () => {
    const images = [
      require('./assets/p1.png'),
      require('./assets/p2.png'),
      require('./assets/p3.png'),
      require('./assets/p4.png'),
      require('./assets/p5.png'),
      require('./assets/p6.png'),
      require('./assets/p7.png'),
      require('./assets/p8.png'),
      require('./assets/p9.png'),
      require('./assets/p10.png'),
      require('./assets/p11.png'),
      require('./assets/p12.png'),
    ];
  
    // Array of alumni profiles
    const profiles = [
      {
        name: 'John Doe',
        role: 'Java Developer',
        imageSource: require('./assets/james.png'),
        companyLogo: require('./assets/sunmicro.png'),
        paragraph: 'He left Sun Microsystems on April 2, 2010, after it was acquired by the Oracle Corporation, citing reductions in pay, status, and decision-making ability, along with change of role and ethical challenges',
      },
      {
        name: 'Guido van Rossum',
        role: 'Python Developer',
        imageSource: require('./assets/guido.png'),
        companyLogo: require('./assets/google.png'),
        paragraph: 'From 2005 to December 2012, Van Rossum worked at Google, where he spent half of his time developing the Python language. At Google, he developed Mondrian, a web-based code review system written in Python and used within the company.',
      },
      // Add more profiles as needed
    ];
  
    return (
      <SafeAreaView style={styles.placementcontainer}>
        <ScrollView contentContainerStyle={styles.placementscrollViewContent}>
          <Text style={styles.placement}>PLACEMENTS</Text>
          <Text style={styles.placementh1}>Our Alumni Are Placed In</Text>
          <Image
            source={require('./assets/underline.png')}
            style={styles.placementunderlineimage}
          />
          <Text style={styles.placementparagraph1}>
            The value we add at BodhaSoft outweighs the investment you make here.
            We aspire to impart industry knowledge at affordable charges and ensure that you achieve your dream job.
          </Text>
          <View style={styles.companiesgrid}>
            {images.map((image, index) => (
              <View key={index} style={styles.companybox}>
                <Image 
                  source={image}
                  style={styles.companyimage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </View>
  
          <View style={styles.getInTouchCard}>
            <Text style={styles.getInTouchCardTitle}>Get In Touch</Text>
            <Text style={styles.bodhasoftMailText}>Info@bodhasoft.com</Text>
          </View>
          <Text style={styles.placementh1}>What Our Students Have To Say</Text>
          <Image
            source={require('./assets/underlinedown.png')}
            style={styles.placementunderlineimagedown}
          />
          <Text style={styles.placementparagraph2}>
            BodhaSoft alumni have secured attractive packages, at entry-level as well as experienced hires with industry giants.
            On cracking multiple competitive tests, BodhaSoft alumni have proudly secured an average package of 6 Lakhs per annum as of 2022.
            Our efforts, at the most affordable prices, have resulted in dream offers, which we are excited to offer every tech aspirant who opts for BodhaSoft.
          </Text>
          <ScrollView horizontal>
            {profiles.map((profile, index) => (
              <ProfileCard key={index} {...profile} />
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const Hoverable = ({ children }) => {
    // State hook to track hover state
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <View
        style={isHovered ? styles.contacthovered : styles.contactnotHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children(isHovered)}
      </View>
    );
  };
  
  // ContactScreen Component
  const ContactScreen = () => {
    // State hooks for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [message, setMessage] = useState('');
  
    // Handler to open email client
    const handleEmailPress = () => {
      Linking.openURL('mailto:info@bodhasoft.com');
    };
  
    // Handler to open social media URLs
    const handleSocialPress = (url) => {
      Linking.openURL(url);
    };
  
    // Handler for form submission
    const handleFormSubmit = () => {
      if (!name || !email || !mobile || !message) {
        Alert.alert('Error', 'Please fill in all fields');
      } else if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
      } else if (!validateMobile(mobile)) {
        Alert.alert('Error', 'Please enter a valid mobile number');
      } else {
        // Submit the form data
        Alert.alert('Success', 'Message submitted successfully');
        // Clear the form fields
        setName('');
        setEmail('');
        setMobile('');
        setMessage('');
      }
    };
  
    // Function to validate email format
    const validateEmail = (email) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    };
  
    // Function to validate mobile number format
    const validateMobile = (mobile) => {
      const pattern = /^[0-9]{10}$/;
      return pattern.test(mobile);
    };
  
    // List of social media icons with URLs and colors
    const socialIcons = [
      { name: 'linkedin', url: 'https://www.linkedin.com/authwall?trk=bf&trkInfo=AQFUeZpXbhMNIAAAAZD4o-z4mu9-X0_EyZ1_qxZd-_0i5jQry3GCzQqQ3h51fFZOvDENZXOjAgTz4l_wQsv79xQRE7sftDuvcSukudUmdGiSQUoAGeW4X90aKwOwU_-60d5Irbc=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fbodhasoftware-technologies-private-limited%2F', color: '#0077b5' },
      { name: 'instagram', url: 'https://www.instagram.com/bodhasoftwaretechnologies/', color: '#E1306C' },
      { name: 'facebook', url: 'https://www.facebook.com/BodhaSoftTech/', color: '#1877F2' },
    ];
  
    // Handler for newsletter subscription
    const handleSubscribe = () => {
      if (!email) {
        Alert.alert('Error', 'Please enter your email address');
      } else if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
      } else {
        // Handle subscription
        Alert.alert('Success', `Subscribed with email: ${email}`);
        // Clear the email field
        setEmail('');
      }
    };
  
    return (
      <SafeAreaView style={styles.contactcontainer}>
        <ScrollView contentContainerStyle={styles.contactscrollViewContent}>
          {/* Frame Section */}
          <View style={styles.contactframe}>
            <Text style={styles.contactframeText}>Contact Us</Text>
          </View>
          {/* Help Text Section */}
          <View style={styles.helpTextContainer}>
            <Text style={styles.contacth1}>Looking for help? Fill the form and start a new adventure.</Text>
          </View>
          {/* Address Section */}
          <View style={styles.contactaddressContainer}>
            <Text style={styles.contacth1}>Address</Text>
            <Text style={styles.contactparagraph}>
              Bodha Software Technologies Private Limited, Dr no.23A-6-7, first floor, GK complex, Behind RR-Peta park, Sankaramatam Road, RR-Peta, Eluru. 534002
            </Text>
          </View>
          {/* Email Section */}
          <View style={styles.defaultContactContainer}>
            <Text style={styles.contacth1}>Email</Text>
            <Text style={styles.contactparagraph} onPress={handleEmailPress}>
              info@bodhasoft.com
            </Text>
          </View>
          {/* Social Media Icons Section */}
          <View style={styles.socialMediaContainer}>
            {socialIcons.map((icon, index) => (
              <Hoverable key={index}>
                {(isHovered) => (
                  <TouchableOpacity
                    onPress={() => handleSocialPress(icon.url)}
                    style={[
                      styles.socialMediaIcon,
                      isHovered && styles.socialMediaIconHovered,
                    ]}
                  >
                    <Icons
                      name={icon.name}
                      size={30}
                      color={isHovered ? '#FFFFFF' : icon.color}
                    />
                  </TouchableOpacity>
                )}
              </Hoverable>
            ))}
          </View>
          {/* Contact Form Section */}
          <View style={styles.defaultContactContainer}>
            <Text style={styles.contacth1}>Get In Touch</Text>
            <Text style={styles.contactparagraph}>Share us your thought and team will connect to you back</Text>
            <TextInput
              style={[styles.input, { marginTop: 20, marginBottom: 10 }]}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { marginTop: 10, marginBottom: 10 }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[styles.input, { marginTop: 10, marginBottom: 10 }]}
              placeholder="Mobile no"
              value={mobile}
              onChangeText={setMobile}
            />
            <TextInput
              style={[styles.input, { height: Math.max(100, message.split('\n').length * 20), marginTop: 10, marginBottom: 10 }]}
              placeholder="Message"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.datasubmitButton}
              onPress={handleFormSubmit}
            >
              <Text style={styles.datasubmitButtonText}>Submit Message</Text>
            </TouchableOpacity>
          </View>
          {/* Programs Section */}
          <View style={styles.defaultContactContainer}>
            <Text style={styles.contacth1}>Our Programs</Text>
            <Text style={styles.contactparagraph}>College to Corporate Program</Text>
            <Text style={styles.contactparagraph}>Upskill Program</Text>
          </View>
          {/* Newsletter Subscription Section */}
          <View style={styles.defaultContactContainer}>
            <Text style={styles.contacth1}>Subscribe To Our Newsletter</Text>
            <Text style={styles.contactparagraph}>
              Enter your email address to register to our newsletter subscription
            </Text>
            <View style={styles.subscribeContainer}>
              <TextInput
                style={[styles.contactDataInput, { marginTop: 20, marginBottom: 20, flex: 1 }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handleSubscribe}
              >
                <Text style={styles.subscribeButtonText}>Subscribe</Text>
                <Icons name="arrow-right" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  // Get window dimensions for responsive design
  const { width: windowsWidths } = Dimensions.get('window');

  const AboutCard = ({ title, imageUrl, description }) => {
    // Calculate the height of the paragraph text
    const paragraphHeight = description ? description.split(' ').length / 10 * 10 : 0;
  
    return (
      <View style={[styles.aboutCard, { marginVertical: 20 }]}>
        <View style={styles.aboutTitleContainer}>
          <Text style={styles.aboutblackText}>
            {title.split(' ')[0]} {/* Display the first word in black */}
          </Text>
          <Text style={styles.aboutredText}>
            {title.split(' ').slice(1).join(' ')} {/* Display the rest of the title in red */}
          </Text>
        </View>
        <Image source={require('./assets/underline.png')} style={styles.aboutunderline} resizeMode="contain" />
        <View style={[styles.aboutimageContainer, Platform.OS === 'ios' ? styles.aboutshadowIOS : styles.aboutshadowAndroid]}>
          <Image source={imageUrl} style={styles.aboutimage} resizeMode="contain" />
        </View>
        <Text style={styles.aboutpara}>{description}</Text>
      </View>
    );
  };
  
  // Get screen dimensions for responsive design
  const { width: windowedWidth } = Dimensions.get('window');
  const cardWidths = windowedWidth * 0.9;
  
  const ChooseCard = ({ imageSource, title, description }) => {
    return (
      <View style={styles.aboutChooseContainer}>
        <View style={styles.aboutChooseCard}>
          <Text style={styles.aboutChooseTitle}>{title}</Text>
          <View style={styles.aboutChooseContent}>
            <View style={styles.aboutChooseImageContainer}>
              <Image source={imageSource} style={styles.aboutChooseImage} resizeMode="contain" />
            </View>
            <Text style={styles.aboutChooseDescription}>{description}</Text>
          </View>
        </View>
      </View>
    );
  };
  
  const { width: windowedWidths } = Dimensions.get('window');
  const cardsWidth = windowedWidths * 0.9;
  const leftMargin = windowedWidths * 0.05;
  const rightMargin = windowedWidths * 0.05;
  
  const TechnologyContainer = ({ imageSource, technology }) => {
    return (
      <View style={styles.techcontainer}>
        <View style={styles.techimageContainer}>
          <Image
            source={imageSource}
            style={styles.techimage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.techtextContainer}>
          <Text style={styles.technologyText}>{technology}</Text>
        </View>
      </View>
    );
  };
  
  //About Us Screen
  const AboutScreen = () => {
    const [email, setEmail] = useState('');
  
    // Array of technology data
    const technologies = [
      { imageUrl: require("./assets/bigdata.png"), technology: "Big Data Hadoop" },
      { imageUrl: require("./assets/ai.png"), technology: "AI" },
      { imageUrl: require("./assets/c.png"), technology: "C Language" },
      { imageUrl: require("./assets/java.png"), technology: "Core Java" },
      { imageUrl: require("./assets/jsp.png"), technology: "JSP" },
      { imageUrl: require("./assets/ds.png"), technology: "Data Structures" },
      { imageUrl: require("./assets/spring.png"), technology: "Spring" },
      { imageUrl: require("./assets/python.png"), technology: "Python" },
      { imageUrl: require("./assets/html.png"), technology: "HTML" },
      { imageUrl: require("./assets/css.png"), technology: "CSS" },
      { imageUrl: require("./assets/js.png"), technology: "JS" },
      { imageUrl: require("./assets/mongodb.png"), technology: "Mongo DB" },
      { imageUrl: require("./assets/mysql.png"), technology: "MySQL" },
      { imageUrl: require("./assets/angular.png"), technology: "Angular" },
      { imageUrl: require("./assets/react.png"), technology: "React" },
      { imageUrl: require("./assets/tableau.png"), technology: "Tableau" },
      { imageUrl: require("./assets/nodejs.png"), technology: "Node JS" },
      { imageUrl: require("./assets/iqt.png"), technology: "IOT" },
      { imageUrl: require("./assets/ntil.png"), technology: "NTIL-V4 Foundation" },
      { imageUrl: require("./assets/tma.png"), technology: "Testing - Manual & Automation" },
      { imageUrl: require("./assets/sap.png"), technology: "SAP(Abap,MM,FI,CO,QM,PP,SD)" },
      { imageUrl: require("./assets/sf.png"), technology: "Salesforce(Classic/ Lightning)" }, 
    ];
  
    // Function to handle subscription
    const handleSubscribe = () => {
      if (!email) {
        Alert.alert('Error', 'Please enter your email address');
      } else if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
      } else {
        // Handle subscription
        Alert.alert('Success', `Subscribed with email: ${email}`);
        // Clear the email field
        setEmail('');
      }
    };
  
    // Function to validate email format
    const validateEmail = (email) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(email);
    };
  
    return (
      <SafeAreaView style={styles.aboutUscontainer}>
        <ScrollView contentContainerStyle={styles.aboutUsscrollViewContent}>
          {/* Frame Section */}
          <View style={styles.aboutUsframe}>
            <Text style={styles.aboutUsframeText}>About Us</Text>
          </View>
  
          {/* About Cards Section */}
          <AboutCard
            title="About Us"
            imageUrl={require("./assets/about1.png")}
            description="Our team aspires to inspire every Trainee who chooses us. Imparting quality skills, at affordable charges being the major objective, we have a truly committed team comprising highly Reputed and Certified Industry Experts as trainers. Concepts are taught with the utmost professionalism, where the trainees are also exposed to Industry level Coding standards and Scenarios."
          />
          <AboutCard
            title="Our Mission"
            imageUrl={require("./assets/about2.png")}
            description="We are aspiring to prove that every Trainee irrespective of his background, academic percentage or work experience can learn and execute programming in any of the Technical language of his choice.So Our Mission is to provide the best quality technical + Cognitive training with high level practical exposure so as to improve knowledge and also thought process which might end the dreaded ''By-Heart technique'' in education."
          />
          <AboutCard
            title="Our Expertise"
            imageUrl={require("./assets/about3.png")}
            description="We have Certified Professionals in technologies like - Salesforce , Java , Microsoft Azure , ITIL etc. The trainers have extensive experience in coaching & follow best trainee friendly procedures to enhance the outreach of subject to every trainee irrespective of his knowledge, confidence and communication."
          />
          <AboutCard
            title="What Makes us Unique ?"
            imageUrl={require("./assets/about4.png")}
            description="At Bodha Soft, we consider each trainee as a new member to our family. Apart from the technical part of coaching, we aim at mental well-being and motivation, which would drive one to success naturally. So, your holistic development and improvement is our target."
          />
  
          {/* Why Choose Us Section */}
          <Text style={styles.h1}>Why Choose Us?</Text>
          <Image source={require('./assets/underlinedown.png')} style={styles.aboutUsunderline} resizeMode="contain" />
          <ScrollView horizontal>
            <ChooseCard
              title="Coaching Right from Basics"
              imageSource={require("./assets/c1.png")}
              description="Basics are the building blocks of Success. At Bodha Soft, Experts in every course lay a strong foundation and then advance to the next levels."
            />
            <ChooseCard
              title="Coaching from Certified Industry Experts"
              imageSource={require("./assets/c2.png")}
              description="Coaching becomes fruitful, only when it is delivered by the best resource and guess what? We have them! Our teams are some of the best, finest Certified Experts in the country."
            />
            <ChooseCard
              title="Interactive Learning"
              imageSource={require("./assets/c3.png")}
              description="We prefer Live 2 - Way interactions to catch your pulse and train you accordingly."
            />
            <ChooseCard
              title="Live Practical Exposure"
              imageSource={require("./assets/c4.png")}
              description="To help you stand out in the market, our Certified Experts will expose you to the latest industry trends and technologies including competitions nation-wide."
            />
            <ChooseCard
              title="Affordable Pricing"
              imageSource={require("./assets/c5.png")}
              description="Affordability is what we promise. With plenty of brilliant minds, financial ability should never be a barrier. Thus, our courses are priced reasonably, with quality uncompromised."
            />
            <ChooseCard
              title="Exposure to Nationwide Job Opportunities"
              imageSource={require("./assets/c6.png")}
              description="Do you have a fear of not getting a Job? No worries..! You just need to relax and learn well. Our dedicated Placement Cell will show the opportunities you need."
            />
            <ChooseCard
              title="Doubt Clarification & Support"
              imageSource={require("./assets/c7.png")}
              description="Learning becomes incomplete without questions. Therefore, we offer exclusive separate doubt clarification sessions and 1:1 doubt sessions."
            />
            <ChooseCard
              title="Weekly Tests and Analysis"
              imageSource={require("./assets/c8.png")}
              description="Best results can only be obtained through self-evaluation and we can help you with that through our regular tests and assessments carefully designed by our experts."
            />
            <ChooseCard
              title="Mentorship"
              imageSource={require("./assets/c9.png")}
              description="We offer full 1:1 Mentorship with Certified Experts for your self-improvement and overall development."
            />
            <ChooseCard
              title="Regular Practice Assignments"
              imageSource={require("./assets/c10.png")}
              description="Practice is the only shortcut to success. Here we offer exclusive daily assignments in both MCQ and Coding formats attested with simplified explanation videos."
            />
            <ChooseCard
              title="In-Depth coding training"
              imageSource={require("./assets/c11.png")}
              description="Who doesn’t love to explore the depths of Coding! We, at Bodha Soft, are here to make it all possible for you. Trust us now and you will trust yourselves in 7 months."
            />
            <ChooseCard
              title="Company based Interview preparation"
              imageSource={require("./assets/c12.png")}
              description="Recruitment stages and processes vary from one company and the other. Bodha Soft aims to support one’s journey to their dream job. Tell us your goals, and we will train you to bag them."
            />
          </ScrollView>
  
          {/* Technology Section */}
          <Text style={styles.techh1}>Technology we Offer</Text>
          <Image source={require('./assets/underline.png')} style={styles.aboutUsunderline} resizeMode="contain" />
          <Text style={styles.aboutUsparagraph}>Join our Bodha Up skill Program and get trained by Certified Industry Experts on Live.</Text>
          <ScrollView horizontal>
            {technologies.map((tech, index) => (
              <TechnologyContainer
                key={index}
                imageSource={tech.imageUrl}
                technology={tech.technology}
              />
            ))}
          </ScrollView>
  
          {/* Subscribe Section */}
          <View style={styles.subscribedContainer}>
            <Text style={styles.subh3}>Subscribe To Our Newsletter</Text>
            <Text style={styles.aboutUsparagraph}>Enter your email address to register to our newsletter subscription</Text>
            <View style={styles.aboutUsinputContainer}>
              <TextInput
                style={styles.aboutUsinput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity
                style={styles.subscribedButton}
                onPress={handleSubscribe}
              >
                <Text style={styles.subscribedButtonText}>Subscribe {'>>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const { width: windowSWidth } = Dimensions.get('window');

const Mentoring = () => (
    <View style={styles.centeredView}>
        <Text>Mentoring Page</Text>
    </View>
);

const Profile = () => (
    <View style={styles.centeredView}>
        <Text>Profile Page</Text>
    </View>
);

const Logout = () => (
    <View style={styles.centeredView}>
        <Text>Logout Page</Text>
    </View>
);

const Header = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Home')}>
                <Image style={styles.home} source={require('./assets/HomeIcon.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Notifications')}>
                <Image style={styles.notification} source={require('./assets/Notification Icon.png')} />
            </TouchableOpacity>
            <Text style={styles.headerText}>BodhaSoft</Text>
            <Image style={styles.logo} source={require('./assets/bodhasoft 1.png')} />
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
                <Image style={styles.menu} source={require('./assets/Menu Icon.png')} />
            </TouchableOpacity>
        </View>
    );
};

const Footer = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('FAQScreen')}>
                <Image style={styles.FAQ} source={require('./assets/FAQIcon.png')} />
                <Text style={styles.footerText}>FAQ's</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('BlogScreen')}>
                <Image style={styles.Blogs} source={require('./assets/BlogsIcon.png')} />
                <Text style={styles.footerText}>Blogs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('PlacementScreen')}>
                <Image style={styles.Placements} source={require('./assets/PlacementsIcon.png')} />
                <Text style={styles.footerText}>Placements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('ContactScreen')}>
                <Image style={styles.Contact} source={require('./assets/ContactUsIcon.png')} />
                <Text style={styles.footerText}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('AboutScreen')}>
                <Image style={styles.About} source={require('./assets/AboutUsIcon.png')} />
                <Text style={styles.footerText}>About Us</Text>
            </TouchableOpacity>
        </View>
    );
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const BrowserSelectionModal = ({ visible, onClose, onSelect }) => {
  const [availableBrowsers, setAvailableBrowsers] = useState([]);

  useEffect(() => {
      const checkBrowsers = async () => {
          const browsers = [
              { name: 'Proceed', url: 'googlechrome://navigate?url=https://www.bodhasoft.com/college-to-corporate-program' },
              { name: 'Proceed', url: 'firefox://open-url?url=https://www.bodhasoft.com/college-to-corporate-program' },
              { name: 'Proceed', url: 'microsoft-edge:https://www.bodhasoft.com/college-to-corporate-program' },
              { name: 'Proceed', url: 'brave://open-url?url=https://www.bodhasoft.com/college-to-corporate-program' }
          ];

          const available = [];

          for (const browser of browsers) {
              const supported = await Linking.canOpenURL(browser.url);
              if (supported) {
                  available.push(browser);
              }
          }

          setAvailableBrowsers(available);
      };

      checkBrowsers();
  }, []);

  return (
      <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
      >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Select a Browser</Text>
                  {availableBrowsers.length > 0 ? (
                      availableBrowsers.map((browser, index) => (
                          <TouchableOpacity key={index} onPress={() => onSelect(browser.url)}>
                              <Text style={{ fontSize: 16, padding: 10 }}>{browser.name}</Text>
                          </TouchableOpacity>
                      ))
                  ) : (
                      <Text style={{ fontSize: 16, padding: 10 }}>No supported browsers found.</Text>
                  )}
                  <TouchableOpacity onPress={onClose}>
                      <Text style={{ fontSize: 16, color: 'red', padding: 10, textAlign: 'center' }}>Cancel</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
  );
};

const CustomDrawerContent = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleBrowserSelection = (url) => {
      setModalVisible(false);
      Linking.canOpenURL(url)
          .then((supported) => {
              if (supported) {
                  return Linking.openURL(url);
              } else {
                  Alert.alert("Browser not installed", "The selected browser is not installed on your device.");
              }
          })
          .catch((err) => console.error("An error occurred", err));
  };

  return (
      <DrawerContentScrollView {...props}>
          <View style={styles.drawerHeader}>
              <Text style={styles.drawerHeaderText}>Menu Bar</Text>
          </View>
          <DrawerItem
              label={() => (
                  <View style={styles.drawerItem}>
                      <Image source={require('./assets/home-icon.png')} style={styles.drawerIcon} />
                      <Text style={styles.drawerLabel}>Home</Text>
                  </View>
              )}
              onPress={() => props.navigation.navigate('Home')}
          />
          <DrawerItem
              label={() => (
                  <View style={styles.drawerItem}>
                      <Image source={require('./assets/ctc.png')} style={styles.drawerIcon} />
                      <Text style={styles.drawerLabel}>College to Corporate</Text>
                  </View>
              )}
              onPress={() => setModalVisible(true)}
          />
          <DrawerItem
              label={() => (
                  <View style={styles.drawerItem}>
                      <Image source={require('./assets/mentoring.png')} style={styles.drawerIcon} />
                      <Text style={styles.drawerLabel}>Mentoring</Text>
                  </View>
              )}
              onPress={() => props.navigation.navigate('Mentoring')}
          />
          <DrawerItem
              label={() => (
                  <View style={styles.drawerItem}>
                      <Image source={require('./assets/profile.png')} style={styles.drawerIcon} />
                      <Text style={styles.drawerLabel}>Profile</Text>
                  </View>
              )}
              onPress={() => props.navigation.navigate('Profile')}
          />
          <DrawerItem
              label={() => (
                  <View style={styles.drawerItem}>
                      <Image source={require('./assets/logout.png')} style={styles.drawerIcon} />
                      <Text style={styles.drawerLabel}>Logout</Text>
                  </View>
              )}
              onPress={() => props.navigation.navigate('Logout')}
          />
          <BrowserSelectionModal
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onSelect={handleBrowserSelection}
          />
      </DrawerContentScrollView>
  );
};

function MainStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TRSubjects" component={TRSubjects} options={{ title: 'Subject Selection' }} />
            <Stack.Screen name="TRQuestions" component={TRQuestions} options={{ title: 'TR Questions' }} />
            <Stack.Screen name="HRQuestions" component={HRQuestions} options={{ title: 'HR Questions' }} />
            <Stack.Screen name="MCQSubjects" component={MCQSubjects} options={{ title: 'Subject Selection' }} />
            <Stack.Screen name="MCQPracticeQuestions" component={MCQPracticeQuestions} options={{ title: 'MCQ Practice Questions' }} />
            <Stack.Screen name="MockInterviews" component={MockInterviews} options={{ title: 'Mock Interviews' }} />
            <Stack.Screen name="WorkshopAreas" component={WorkshopAreas} options={{ title: 'Workshop Area' }} />
            <Stack.Screen name="PollDivision" component={PollDivision} options={{ title: 'Poll Division' }} />
            <Stack.Screen name="CodingEnvironment" component={CodingEnvironment} options={{ title: 'Coding Environment' }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ title: 'Notifications' }} />
            <Stack.Screen name="FAQScreen" component={FAQScreen} options={{ title: 'FAQ' }} />
            <Stack.Screen name="BlogScreen" component={BlogScreen} options={{ title: 'Blogs' }} />
            <Stack.Screen name="PlacementScreen" component={PlacementScreen} options={{ title: 'Placements' }} />
            <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ title: 'Contact Us' }} />
            <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ title: 'About Us' }} />
            <Stack.Screen name="Mentoring" component={Mentoring} options={{ title: 'Mentoring' }} />
            <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
            <Stack.Screen name="Logout" component={Logout} options={{ title: 'Logout' }} />
        </Stack.Navigator>
    );
}

const DrawerNavigator = () => (
    <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            header: (props) => <Header {...props} />,
        }}
    >
        <Drawer.Screen name="MainStack" component={MainStack} />
    </Drawer.Navigator>
);

export default function App() {
    return (
        <NavigationContainer>
            <View style={styles.container}>
                <DrawerNavigator />
                <Footer />
            </View>
        </NavigationContainer>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 60,
        width: '100%',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#9712FF',
        borderBottomWidth: 1,
        marginTop: 35,
    },
    headerButton: {
        flex: 1,
        alignItems: 'center',
    },
    home: {
        width: 34,
        height: 27,
    },
    notification: {
        width: 20.16,
        height: 28,
        marginRight: 20,
    },
    menu: {
        width: 30,
        height: 20,
        marginRight: -2,
    },
    logo: {
        width: 64,
        height: 56,
        marginLeft: 5,
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 33,
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        marginRight: 35,
    },
    landing: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    landingpageboxes: {
        flexDirection: 'row',
        columnGap: 20,
        marginBottom: 20,
        marginLeft: 15,
        marginRight: -20,
    },
    landingsmallbox: {
        width: '43%',
        height: 168,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 4,
        shadowRadius: 2,
        elevation: 5,
        overflow: 'auto',
    },
  
    landingimageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(143, 0, 255, 0.45)',
    },
    landingboxText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    footerButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    footerText: {
        color: '#000000',
        fontSize: 12,
    },
    FAQ: {
        width: 50,
        height: 33.5,
        marginBottom: 5,
    },
    Blogs: {
        width: 50,
        height: 39.7,
        marginBottom: 5,
    },
    Placements: {
        width: 27,
        height: 40.5,
        marginBottom: 5,
    },
    Contact: {
        width: 50,
        height: 33.5,
        marginBottom: 5,
    },
    About: {
        width: 39,
        height: 39.76,
        marginBottom: 5,
        marginLeft: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: '#9712FF',
    },
    drawerHeaderText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    drawerIcon: {
        width: 24,
        height: 24,
        marginRight: 20,
    },
    drawerLabel: {
        fontSize: 16,
    },
    workbackground: {
        flex: 1,
        resizeMode: 'cover',
        overflow: 'auto',
      },
      works: {
        flex: 1,
      },
      workcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
      },
      workbutton: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
      },
      pollButton: {
        marginLeft: -110,
        margin: 10,
      },
      ceButton: {
        marginRight: -110,
        margin: 20,
      },
      workimageWrapper: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'auto',
      },
      buttonImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      imageStyle: {
        borderRadius: 20,
      },
      workText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'absolute',
      },
      workoverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(143, 0, 255, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
      },
      subjectcontainer: {
        flex: 1,
        backgroundColor: '#D4B5FF',
      },
      subjectbackground: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        height: '85%',
        backgroundColor: '#f8f8ff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      },
      subjectContainer: {
        flex: 1,
        marginTop: 60,
        paddingHorizontal: 35,
      },
      subjectRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      subjectItemWrapper: {
        flex: 1,
        marginHorizontal: 5,
      },
      subjectItem: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      subjectIcon: {
        width: 80,
        height: 90,
        marginBottom: 10,
      },
      subjectName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      noSubjectsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888888',
      },
      scrollContainer: {
        paddingHorizontal: 0,
      },
      trcontainer: {
	    flex: 1,
	    backgroundColor: '#ffffff',
      },
      questionsContainer: {
        flexGrow: 1,
        width: '100%',
        marginTop: 0,
        paddingHorizontal: 35,
      },
      containerquestion: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
      },
      linetr: {
          borderBottomWidth: 1,
          borderBottomColor: '#4C4C4C',
          marginBottom: 5,
      },
      questionbox: {
        borderRadius:5,
        borderColor: 'black',
        width: 320,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#ffffff',
        elevation: 3, // Add elevation for drop shadow effect on Android
        shadowColor: '#000', // Add shadow properties for iOS
          shadowOffset: {
            width: 0,
            height: 2,
        },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
      },
      questionboxPressed: {
        backgroundColor: 'white',
      },
      answerbox: {
        paddingTop: 10,
      },
      textquestion: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      questionText: {
        fontSize: 16,
        color: '#9712FF',
        fontWeight: 'bold',
      },
      answerText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      faqitemcontainer: {
        width: questionBoxWidth,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      faqitemexpandedContainer: {
        marginBottom: 20,
      },
      faqitemquestionContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      },
      faqitemquestion: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      faqitemanswerContainer: {
        padding: 10,
      },
      faqitemline: {
        borderBottomWidth: 1,
        borderBottomColor: '#4C4C4C',
        marginBottom: 5,
      },
      faqitemanswer: {
        fontSize: 16,
      },
      faqcontainer: {
        flex: 1,
        backgroundColor: '#fff',
      },
      faqscrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        alignItems: 'center',
      },
      faqText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
      },
      faqimageContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 25,
      },
      faqunderlineImage: {
        width: 300,
        height: 20,
        resizeMode: 'contain',
      },
      blogsloadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 1,
      },
      placementcontainer: {
        flex: 1,
        backgroundColor: '#fff',
      },
      placementscrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
      },
      placement: {
        fontSize: 20,
        color: '#706976',
        marginBottom: 20,
        textAlign: 'center',
      },
      placementh1: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 15,
        textAlign: 'center',
      },
      placementunderlineimage: {
        alignSelf: 'center',
        width: 150,
        marginTop: -20,
        resizeMode: 'contain',
      },
      placementunderlineimagedown: {
        alignSelf: 'center',
        width: 250,
        marginTop: -50,
        resizeMode: 'contain',
      },
      placementparagraph1: {
        color: '#706976',
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        marginBottom: 20,
        textAlign: 'justify'
      },
      placementparagraph2: {
        color: '#706976',
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        marginTop: -35,
        marginBottom: 20,
        textAlign: 'justify'
      },
      companiesgrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      companybox: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
      },
      companyimage: {
        width: '90%',
        height: '100%',
      },
      getInTouchCard: {
        backgroundColor: '#6E37F9',
        height: 150,
        width: '95%',
        alignSelf: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 25,
        shadowColor: '#6E37F9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
      },
      getInTouchCardTitle: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 10,
      },
      bodhasoftMailText: {
        fontSize: 16,
        color: '#FFFFFF',
      },
      Profilecontainer: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        height: 500,
        width: 350,
      },
      profileleftContent: {
        marginVertical: 30,
        marginLeft: 10,
        flex: 1,
        justifyContent: 'space-between',
      },
      profilerightContent: {
        flex: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginRight: 10,
        marginTop: 30,
      },
      profileimage: {
        width: 80,
        height: 80,
        borderRadius: 40,
      },
      profilecompanyContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
      },
      placedInText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
      },
      profilecompanyLogo: {
        width: 150,
        height: 100,
        resizeMode: 'contain',
      },
      alumniname: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 10,
      },
      alumnirole: {
        fontSize: 16,
        color: '#000000',
        marginRight: 10,
        marginBottom: 5,
      },
      starsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
        marginBottom: 5,
      },
      star: {
        fontSize: 20,
        color: 'yellow',
      },
      selectedStar: {
        color: 'orange',
      },
      Alumniparagraph: {
        color: '#706976',
        fontSize: 16,
        width: 330,
        padding: 5,
        textAlign: 'justify',
      },
      contacthovered: {
        backgroundColor: '#9712FF',
        shadowColor: '#9712FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      contactnotHovered: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      contactcontainer: {
        flex: 1,
        backgroundColor: '#fff',
      },
      contactscrollViewContent: {
        flexGrow: 1,
      },
      contactframe: {
        width: '100%',
        height: 70,
        backgroundColor: '#6E37F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },
      contactframeText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
      },
      helpTextContainer: {
        padding: 10,
        justifyContent: 'flex-start',
      },
      contactaddressContainer: {
        padding: 10,
        justifyContent: 'flex-start',
      },
      defaultContactContainer: {
        padding: 10,
        justifyContent: 'flex-start',
      },
      contacth1: {
        color: '#000000',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'left',
      },
      contactparagraph: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'normal',
        textAlign: 'justify',
        marginTop: 5,
      },
      socialMediaContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
      },
      socialMediaIcon: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 8,
        width: 50,
        height: 50,
      },
      socialMediaIconHovered: {
        backgroundColor: '#9712FF',
        shadowColor: '#9712FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      contactDataInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: '100%',
      },
      datasubmitButton: {
        backgroundColor: '#9712FF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      datasubmitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
      },
      subscribeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      subscribeButton: {
        backgroundColor: '#9712FF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 10,
      },
      subscribeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
      },
      aboutUscontainer: {
        flex: 1,
        backgroundColor: '#fff',
      },
      aboutUsscrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        marginBottom: 20,
      },
      aboutUsframe: {
        width: windowSWidth,
        height: 70,
        backgroundColor: '#6E37F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },
      aboutUsframeText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
      },
      techh1: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        marginTop: 20,
      },
      subh3: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
      },
      aboutUsunderline: {
        marginTop: 10,
        marginBottom: 10,
        width: '90%',
        height: 25,
        alignSelf: 'center',
      },
      aboutUsparagraph: {
        fontSize: 14,
        textAlign: 'justify',
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      aboutUsinputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 50,
        paddingHorizontal: 10,
      },
      aboutUsinput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
      },
      subscribedContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop:10,
        marginBottom: 20,
      },
      subscribedButton: {
        backgroundColor: '#6E37F9',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
      },
      subscribedButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      aboutCard: {
        width: cardWidths,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 8,
      },
      aboutTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'center',
      },
      aboutblackText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
      },
      aboutredText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'red',
      },
      aboutunderline: {
        width: '80%',
        height: 15,
        alignSelf: 'center',
      },
      aboutimageContainer: {
        alignItems: 'center',
        marginBottom: 10,
        overflow: 'auto',
      },
      aboutimage: {
        width: '70%',
        height: 250,
        borderRadius: 10,
      },
      aboutpara: {
        textAlign: 'justify',
      },
      aboutshadowIOS: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      aboutshadowAndroid: {
        elevation: 5,
      },
      aboutChooseContainer: {
        marginBottom: 20,
        alignItems: 'center',
      },
      aboutChooseCard: {
        width: cardsWidth,
        height: 250,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginLeft: leftMargin,
        marginRight: rightMargin,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 8,
        marginBottom: 20,
      },
      aboutChooseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
      },
      aboutChooseContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      aboutChooseImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'auto',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      aboutChooseImage: {
        width: 60,
        height: 60,
      },
      aboutChooseDescription: {
        flex: 1,
        fontSize: 14,
        textAlign: 'justify',
      },
      techcontainer: {
        width: 100,
        height: 100,
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
      },
      techimageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
      },
      techimage: {
        width: 80,
        height: 80,
      },
      techtextContainer: {
        height: 20,
        backgroundColor: '#6E37F9',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
      },
      technologyText: {
        color: '#FFFFFF',
        textAlign: 'center',
      },
      

 
  errorText: {
    color: 'red',
  },
  questionContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '90%',
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  correctOptionButton: {
    backgroundColor: '#a5d6a7',
  },
  incorrectOptionButton: {
    backgroundColor: '#ef9a9a',
  },
  optionText: {
    fontSize: 16,
  },
  feedbackText: {
    marginTop: 10,
    fontSize: 16,
    color: '#9c27b0',
  },

    
});
