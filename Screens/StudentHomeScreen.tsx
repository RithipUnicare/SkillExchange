import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Appbar, Searchbar, Card, Text, Avatar, Chip, useTheme, IconButton, FAB } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigation/AppNavigation';
import { useUser } from '../context/UserContext';
import { useAppTheme } from '../context/ThemeContext';
import apiService from '../services/apiService';
import { Profile } from '../types/user.types';

type props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'studentHome'>;
}

export default function StudentHomeScreen({ navigation }: props) {
    const theme = useTheme();
    const { isDark, toggleTheme } = useAppTheme();
    const { user, clearUser } = useUser();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        loadProfiles();
    }, [searchQuery, selectedSkill]);

    const loadProfiles = async () => {
        setLoading(true);
        try {
            const skillParam = selectedSkill || undefined;
            const nameParam = searchQuery || (selectedSkill ? undefined : '');

            const response = await apiService.searchUsers(
                skillParam,
                nameParam,
                page,
                20
            );
            if (response.success && response.data) {
                setProfiles(response.data.content);
            }
        } catch (error) {
            console.error('Error loading profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await apiService.clearTokens();
                    clearUser();
                    navigation.replace('login');
                },
            },
        ]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
                <Appbar.Content title="SkillExchange" titleStyle={{ fontWeight: 'bold' }} />
                <IconButton
                    icon={isDark ? 'weather-sunny' : 'weather-night'}
                    size={24}
                    onPress={toggleTheme}
                    iconColor={theme.colors.primary}
                />
                <IconButton icon="logout" size={24} onPress={handleLogout} />
            </Appbar.Header>

            <View style={styles.container}>
                {selectedSkill ? (
                    <View style={styles.filterContainer}>
                        <Chip
                            mode="flat"
                            selected
                            onClose={() => setSelectedSkill('')}
                            style={styles.selectedChip}
                        >
                            Filter: {selectedSkill}
                        </Chip>
                    </View>
                ) : null}

                <Searchbar
                    placeholder="Search by name or skill"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                <ScrollView
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProfiles} />}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text variant="headlineSmall" style={[styles.welcomeText, { color: theme.colors.primary }]}>
                        Welcome, {user?.name}
                    </Text>

                    {profiles.map((profile) => (
                        <Card
                            key={profile.userId}
                            style={[styles.card, { backgroundColor: theme.colors.surface }]}
                        >
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <Avatar.Image
                                        size={50}
                                        source={{ uri: profile.profileImageUrl || 'https://via.placeholder.com/150' }}
                                    />
                                    <View style={styles.cardInfo}>
                                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                                            {profile.name}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                            {profile.collegeName || 'No college'} • {profile.department || 'N/A'}
                                        </Text>
                                    </View>
                                </View>

                                {profile.bio && (
                                    <Text variant="bodyMedium" style={styles.bio} numberOfLines={2}>
                                        {profile.bio}
                                    </Text>
                                )}

                                {profile.skills && profile.skills.length > 0 && (
                                    <View style={styles.skillsContainer}>
                                        {profile.skills.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                mode="outlined"
                                                compact
                                                style={styles.chip}
                                                onPress={() => setSelectedSkill(skill)}
                                            >
                                                {skill}
                                            </Chip>
                                        ))}
                                    </View>
                                )}
                            </Card.Content>
                        </Card>
                    ))}

                    {profiles.length === 0 && !loading && (
                        <Text variant="bodyLarge" style={styles.emptyText}>
                            No profiles found. Try a different search!
                        </Text>
                    )}
                </ScrollView>
            </View>

            <FAB
                icon="account-edit"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('profile')}
                label="My Profile"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    filterContainer: {
        marginBottom: 12,
    },
    selectedChip: {
        alignSelf: 'flex-start',
    },
    searchBar: {
        marginBottom: 16,
        elevation: 2,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    welcomeText: {
        marginBottom: 20,
        fontWeight: 'bold',
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardInfo: {
        marginLeft: 12,
        flex: 1,
    },
    bio: {
        marginTop: 8,
        opacity: 0.8,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8,
    },
    chip: {
        marginRight: 4,
        marginBottom: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        opacity: 0.6,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
