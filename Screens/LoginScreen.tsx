import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme, ActivityIndicator, IconButton, Appbar } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigation';
import apiService from '../services/apiService';
import { useAppTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';

type props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'login'>;
}

export default function LoginScreen({ navigation }: props) {
    const theme = useTheme();
    const { isDark, toggleTheme } = useAppTheme();
    const { fetchUser } = useUser();
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!mobileNumber || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (mobileNumber.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.login(mobileNumber, password);
            console.log(response);
            if (response.success) {
                await fetchUser();
                const userResponse = await apiService.getCurrentUser();
                if (userResponse.success && userResponse.data) {
                    const role = userResponse.data.roles?.toLowerCase();
                    if (role === 'superadmin') {
                        navigation.replace('adminHome');
                    } else {
                        navigation.replace('studentHome');
                    }
                }
            } else {
                Alert.alert('Error', response.message || 'Login failed');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
                <Appbar.Content title="Login" titleStyle={{ fontWeight: 'bold' }} />
                <IconButton
                    icon={isDark ? 'weather-sunny' : 'weather-night'}
                    size={24}
                    onPress={toggleTheme}
                    iconColor={theme.colors.primary}
                />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]} elevation={4}>
                        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
                            Welcome Back
                        </Text>
                        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurface }]}>
                            Login to your account
                        </Text>

                        <TextInput
                            label="Mobile Number"
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            keyboardType="number-pad"
                            maxLength={10}
                            mode="outlined"
                            left={<TextInput.Icon icon="phone" />}
                            style={styles.input}
                            disabled={loading}
                        />

                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            mode="outlined"
                            left={<TextInput.Icon icon="lock" />}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                            style={styles.input}
                            disabled={loading}
                        />

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            style={styles.loginButton}
                            contentStyle={styles.buttonContent}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : 'Login'}
                        </Button>

                        <Button
                            mode="text"
                            onPress={() => navigation.replace('signin')}
                            style={styles.textButton}
                            disabled={loading}
                        >
                            Don't have an account? Sign Up
                        </Button>
                    </Surface>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    surface: {
        padding: 30,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.7,
    },
    input: {
        marginBottom: 16,
    },
    loginButton: {
        marginTop: 10,
        marginBottom: 10,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    textButton: {
        marginTop: 8,
    },
});
