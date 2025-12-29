import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import SigninScreen from '../Screens/SigninScreen';
import AdminHomeScreen from '../Screens/AdminHomeScreen';
import StudentHomeScreen from '../Screens/StudentHomeScreen';
import SkillsManagementScreen from '../Screens/SkillsManagementScreen';
import ViewProfileScreen from '../Screens/ViewProfileScreen';
import ProfileScreen from '../Screens/ProfileScreen';

export type RootStackParamList = {
    login: undefined;
    signin: undefined;
    adminHome: undefined;
    studentHome: undefined;
    skillsManagement: undefined;
    viewProfile: { userId: number };
    profile: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="login"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="login" component={LoginScreen} />
                <Stack.Screen name="signin" component={SigninScreen} />
                <Stack.Screen name="adminHome" component={AdminHomeScreen} />
                <Stack.Screen name="studentHome" component={StudentHomeScreen} />
                <Stack.Screen name="skillsManagement" component={SkillsManagementScreen} />
                <Stack.Screen name="viewProfile" component={ViewProfileScreen} />
                <Stack.Screen name="profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigation;