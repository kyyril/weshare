import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { theme } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";

const RichTextEditor = ({ editorRef, onChange }) => {
  return (
    <View style={styles.container}>
      {/* Radiant background effect */}
      <LinearGradient
        colors={["rgba(127, 90, 240, 0.2)", "rgba(242, 95, 76, 0.2)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      />

      <View style={styles.editorContainer}>
        <RichToolbar
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.keyboard,
            actions.setStrikethrough,
            actions.setUnderline,
            actions.removeFormat,
            actions.checkboxList,
            actions.undo,
            actions.redo,
            actions.heading1,
            actions.heading4,
          ]}
          iconMap={{
            [actions.heading1]: ({ tintColor }) => (
              <Text style={[styles.headingText, { color: tintColor }]}>H1</Text>
            ),
            [actions.heading4]: ({ tintColor }) => (
              <Text style={[styles.headingText, { color: tintColor }]}>H4</Text>
            ),
          }}
          style={styles.richBar}
          flatContainerStyle={styles.flatStyle}
          editor={editorRef}
          disabled={false}
          selectedIconTint={theme.colors.primary}
          iconTint={theme.colors.text}
        />

        <RichEditor
          ref={editorRef}
          containerStyle={styles.rich}
          editorStyle={styles.contentStyle}
          placeholder="Write something"
          onChange={onChange}
          initialContentHTML=""
        />
      </View>
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    minHeight: 285,
    marginVertical: 10,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  editorContainer: {
    overflow: "hidden",
    borderRadius: theme.radius.xl,
    backgroundColor: "transparent",
  },
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: "rgba(30, 30, 30, 0.57)",
    backdropFilter: "blur(8px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomRightRadius: theme.radius.xl,
    borderBottomLeftRadius: theme.radius.xl,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(30, 30, 30, 0.57)",
    backdropFilter: "blur(8px)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentStyle: {
    color: theme.colors.text,
    placeholderColor: theme.colors.textLight,
    backgroundColor: "transparent",
  },
  flatStyle: {
    paddingHorizontal: 12,
    gap: 8,
  },
  headingText: {
    fontWeight: theme.fonts.bold,
  },
});
