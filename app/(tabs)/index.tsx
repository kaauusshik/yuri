import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Mock Data ───────────────────────────────────────────────
interface QuickAction {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
}

const quickActions: QuickAction[] = [
  { id: '1', icon: 'camera-outline', label: 'Try-On', route: '/(tabs)/tryon' },
  { id: '2', icon: 'grid-outline', label: 'Wardrobe', route: '/(tabs)/wardrobe' },
  { id: '3', icon: 'sparkles-outline', label: 'Stylist', route: '/stylist' },
  { id: '4', icon: 'compass-outline', label: 'Discover', route: '/(tabs)/discover' },
];

interface StudioCard {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  gradientColors: [string, string, string];
}

const studioCards: StudioCard[] = [
  {
    id: '1',
    icon: 'camera',
    title: 'Photo Try-On',
    description: 'Upload a photo to see yourself in any outfit',
    gradientColors: ['#2D1B69', '#1E1533', Colors.midnight],
  },
  {
    id: '2',
    icon: 'videocam',
    title: 'Live Try-On',
    description: 'Real-time outfit switching with AR',
    gradientColors: ['#1B4332', '#1A2F2A', Colors.midnight],
  },
  {
    id: '3',
    icon: 'film',
    title: 'Video Try-On',
    description: 'Transform your outfit in videos',
    gradientColors: ['#4A2C17', '#2A1F15', Colors.midnight],
  },
];

interface Product {
  id: string;
  brand: string;
  title: string;
  price: string;
  gradientColors: [string, string];
}

const recommendedProducts: Product[] = [
  { id: '1', brand: 'ALLEN SOLLY', title: 'Slim Fit Casual Shirt', price: '₹1,299', gradientColors: ['#3A2D5E', '#1E1533'] },
  { id: '2', brand: 'H&M', title: 'Oversized Hoodie', price: '₹1,999', gradientColors: ['#2D4A3E', '#1A2F2A'] },
  { id: '3', brand: 'ZARA', title: 'Textured Blazer', price: '₹4,990', gradientColors: ['#4A3D2D', '#2A2117'] },
  { id: '4', brand: 'VAN HEUSEN', title: 'Classic Polo T-Shirt', price: '₹999', gradientColors: ['#2D3A5E', '#1A1F33'] },
  { id: '5', brand: 'ROADSTER', title: 'Denim Jacket', price: '₹1,599', gradientColors: ['#3A2D4E', '#1E1528'] },
];

interface InspirationCard {
  id: string;
  label: string;
  gradientColors: [string, string];
}

const inspirationCards: InspirationCard[] = [
  { id: '1', label: 'Casual Chic', gradientColors: ['#3A2D5E', '#1E1533'] },
  { id: '2', label: 'Formal Elegance', gradientColors: ['#2D4A3E', '#1A2F2A'] },
  { id: '3', label: 'Street Style', gradientColors: ['#4A3D2D', '#2A2117'] },
  { id: '4', label: 'Party Ready', gradientColors: ['#5E2D4A', '#331A2F'] },
];

// ─── Component ───────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>YURI</Text>
          <Text style={styles.logoAI}> AI</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color={Colors.ivory} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton} activeOpacity={0.7}>
            <LinearGradient
              colors={[Colors.lavender, '#9B85E3']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>KM</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={18} color={Colors.mutedText} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search outfits, brands, styles..."
        placeholderTextColor={Colors.mutedText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity activeOpacity={0.7}>
        <Ionicons name="options-outline" size={18} color={Colors.mutedText} />
      </TouchableOpacity>
    </View>
  );

  const renderAICard = () => (
    <LinearGradient
      colors={['#2D1B69', '#1E1533', Colors.midnight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.aiCard}
    >
      <View style={styles.aiCardHeader}>
        <View style={styles.aiIconContainer}>
          <Ionicons name="sparkles" size={20} color={Colors.lavender} />
        </View>
        <Text style={styles.aiCardTitle}>AI Style Assistant</Text>
      </View>
      <Text style={styles.aiCardSubtitle}>What are we dressing for today?</Text>
      <View style={styles.aiInputRow}>
        <TextInput
          style={styles.aiInput}
          placeholder="Suggest an outfit for tonight..."
          placeholderTextColor="rgba(200, 180, 255, 0.4)"
        />
        <TouchableOpacity style={styles.aiSendButton} activeOpacity={0.7}>
          <LinearGradient
            colors={[Colors.lavender, '#9B85E3']}
            style={styles.aiSendGradient}
          >
            <Ionicons name="arrow-forward" size={18} color={Colors.midnight} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsRow}>
      {quickActions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.quickAction}
          activeOpacity={0.7}
          onPress={() => router.push(action.route as any)}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name={action.icon} size={22} color={Colors.lavender} />
          </View>
          <Text style={styles.quickActionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSectionHeader = (title: string, onSeeAll?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStudioCards = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.studioScroll}
    >
      {studioCards.map((card) => (
        <TouchableOpacity key={card.id} activeOpacity={0.85}>
          <LinearGradient
            colors={card.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.studioCard}
          >
            <View style={styles.studioCardContent}>
              <View style={styles.studioIconBg}>
                <Ionicons name={card.icon} size={28} color={Colors.lavender} />
              </View>
              <View style={styles.studioCardText}>
                <Text style={styles.studioCardTitle}>{card.title}</Text>
                <Text style={styles.studioCardDesc}>{card.description}</Text>
              </View>
            </View>
            <View style={styles.studioCardArrow}>
              <Ionicons name="arrow-forward-circle" size={28} color="rgba(200, 180, 255, 0.3)" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderRecommendedProducts = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.productsScroll}
    >
      {recommendedProducts.map((product) => (
        <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.85}>
          <LinearGradient
            colors={product.gradientColors}
            style={styles.productImage}
          >
            <View style={styles.tryOnBadge}>
              <Ionicons name="sparkles" size={10} color={Colors.midnight} />
              <Text style={styles.tryOnBadgeText}>Try On</Text>
            </View>
            <Ionicons name="shirt-outline" size={40} color="rgba(200, 180, 255, 0.2)" />
          </LinearGradient>
          <View style={styles.productInfo}>
            <Text style={styles.productBrand}>{product.brand}</Text>
            <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderInspirationGrid = () => (
    <View style={styles.inspirationGrid}>
      {inspirationCards.map((card, index) => (
        <TouchableOpacity key={card.id} style={styles.inspirationCard} activeOpacity={0.85}>
          <LinearGradient
            colors={card.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.inspirationGradient,
              { height: index % 2 === 0 ? 140 : 120 },
            ]}
          >
            <View style={styles.inspirationOverlay}>
              <Ionicons name="heart-outline" size={18} color="rgba(255,255,255,0.5)" style={styles.inspirationHeart} />
              <Text style={styles.inspirationLabel}>{card.label}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.midnight} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {renderHeader()}
        {renderSearchBar()}
        {renderAICard()}
        {renderQuickActions()}

        {renderSectionHeader('Your Fashion Studio', () => {})}
        {renderStudioCards()}

        {renderSectionHeader('Recommended for You', () => {})}
        {renderRecommendedProducts()}

        {renderSectionHeader('Style Inspiration')}
        {renderInspirationGrid()}
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    paddingHorizontal: Layout.screen.paddingHorizontal,
    paddingTop: 12,
    paddingBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    ...Typography.h3,
    color: Colors.ivory,
    letterSpacing: 2,
  },
  logoAI: {
    ...Typography.h3,
    color: Colors.lavender,
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.midnight,
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Typography.label,
    color: Colors.midnight,
    fontSize: 12,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    marginHorizontal: Layout.screen.paddingHorizontal,
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.ivory,
    paddingVertical: 0,
  },

  // AI Card
  aiCard: {
    marginHorizontal: Layout.screen.paddingHorizontal,
    borderRadius: Layout.radius.xl,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(200, 180, 255, 0.12)',
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  aiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(200, 180, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCardTitle: {
    ...Typography.label,
    color: Colors.lavender,
    fontSize: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
  aiCardSubtitle: {
    ...Typography.h3,
    color: Colors.ivory,
    marginBottom: 16,
    fontSize: 20,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiInput: {
    flex: 1,
    backgroundColor: 'rgba(200, 180, 255, 0.08)',
    borderRadius: Layout.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Typography.bodySmall,
    color: Colors.ivory,
    borderWidth: 1,
    borderColor: 'rgba(200, 180, 255, 0.1)',
  },
  aiSendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  aiSendGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Layout.screen.paddingHorizontal,
    marginBottom: 28,
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(200, 180, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 180, 255, 0.15)',
  },
  quickActionLabel: {
    ...Typography.caption,
    color: Colors.ivory,
    fontWeight: '500',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.screen.paddingHorizontal,
    marginBottom: 14,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.ivory,
  },
  seeAllText: {
    ...Typography.bodySmall,
    color: Colors.lavender,
  },

  // Studio Cards
  studioScroll: {
    paddingLeft: Layout.screen.paddingHorizontal,
    paddingRight: 8,
    gap: 12,
    marginBottom: 28,
  },
  studioCard: {
    width: 220,
    height: 180,
    borderRadius: Layout.radius.xl,
    padding: 18,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(200, 180, 255, 0.08)',
  },
  studioCardContent: {
    gap: 12,
  },
  studioIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(200, 180, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studioCardText: {
    gap: 4,
  },
  studioCardTitle: {
    ...Typography.h4,
    color: Colors.ivory,
    fontSize: 16,
  },
  studioCardDesc: {
    ...Typography.caption,
    color: Colors.mutedText,
    lineHeight: 17,
  },
  studioCardArrow: {
    alignSelf: 'flex-end',
  },

  // Products
  productsScroll: {
    paddingLeft: Layout.screen.paddingHorizontal,
    paddingRight: 8,
    gap: 12,
    marginBottom: 28,
  },
  productCard: {
    width: 150,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productImage: {
    width: 150,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tryOnBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.lavender,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tryOnBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.midnight,
  },
  productInfo: {
    padding: 12,
    gap: 3,
  },
  productBrand: {
    ...Typography.caption,
    color: Colors.mutedText,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  productTitle: {
    ...Typography.bodySmall,
    color: Colors.ivory,
    fontSize: 13,
  },
  productPrice: {
    ...Typography.body,
    color: Colors.ivory,
    fontWeight: '700',
    fontSize: 15,
    marginTop: 2,
  },

  // Inspiration
  inspirationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Layout.screen.paddingHorizontal,
    gap: 12,
    marginBottom: 24,
  },
  inspirationCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    borderRadius: Layout.radius.lg,
    overflow: 'hidden',
  },
  inspirationGradient: {
    width: '100%',
    justifyContent: 'flex-end',
    padding: 14,
    position: 'relative',
  },
  inspirationOverlay: {
    gap: 4,
  },
  inspirationHeart: {
    position: 'absolute',
    top: -60,
    right: 0,
  },
  inspirationLabel: {
    ...Typography.h4,
    color: Colors.ivory,
    fontSize: 15,
  },
});
