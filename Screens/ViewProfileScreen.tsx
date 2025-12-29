import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, Card, Text, Avatar, Chip, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Navigation/AppNavigation';
import { useAppTheme } from '../context/ThemeContext';
import apiService from '../services/apiService';
import { Profile } from '../types/user.types';

type props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'viewProfile'>;
    route: RouteProp<RootStackParamList, 'viewProfile'>;
}

export default function ViewProfileScreen({ navigation, route }: props) {
    const theme = useTheme();
    const { isDark, toggleTheme } = useAppTheme();
    const { userId } = route.params;
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const response = await apiService.getProfileById(userId);
            if (response.success && response.data) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Profile" titleStyle={{ fontWeight: 'bold' }} />
                <IconButton
                    icon={isDark ? 'weather-sunny' : 'weather-night'}
                    size={24}
                    onPress={toggleTheme}
                    iconColor={theme.colors.primary}
                />
            </Appbar.Header>

            <ScrollView style={styles.container}>
                {profile && (
                    <>
                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <View style={styles.header}>
                                    <Avatar.Image
                                        size={80}
                                        source={{ uri: profile.profileImageUrl || 'https://via.placeholder.com/150' }}
                                    />
                                    <View style={styles.headerInfo}>
                                        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                                            {profile.name}
                                        </Text>
                                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                            {profile.department || 'No department'}
                                        </Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>

                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <Text variant="titleMedium" style={styles.sectionTitle}>
                                    About
                                </Text>
                                <Text variant="bodyMedium" style={styles.bio}>
                                    {profile.bio || 'No bio available'}
                                </Text>
                            </Card.Content>
                        </Card>

                        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <Text variant="titleMedium" style={styles.sectionTitle}>
                                    Education
                                </Text>
                                <Text variant="bodyMedium">
                                    College: {profile.collegeName || 'Not specified'}
                                </Text>
                                <Text variant="bodyMedium">
                                    Department: {profile.department || 'Not specified'}
                                </Text>
                                <Text variant="bodyMedium">
                                    Year: {profile.yearOfStudy || 'Not specified'}
                                </Text>
                                <Text variant="bodyMedium">
                                    Location: {profile.location || 'Not specified'}
                                </Text>
                            </Card.Content>
                        </Card>

                        {profile.skills && profile.skills.length > 0 && (
                            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                                <Card.Content>
                                    <Text variant="titleMedium" style={styles.sectionTitle}>
                                        Skills
                                    </Text>
                                    <View style={styles.skillsContainer}>
                                        {profile.skills.map((skill, index) => (
                                            <Chip key={index} mode="outlined" style={styles.chip}>
                                                {skill}
                                            </Chip>
                                        ))}
                                    </View>
                                </Card.Content>
                            </Card>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerInfo: {
        marginLeft: 16,
        flex: 1,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    bio: {
        opacity: 0.8,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        marginRight: 4,
        marginBottom: 4,
    },
});
