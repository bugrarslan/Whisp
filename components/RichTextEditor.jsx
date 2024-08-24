import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { theme } from "../constants/theme";

const RichTextEditor = ({ editorRef, onChange }) => {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
            actions.setStrikethrough,
            actions.removeFormat,
            actions.setBold,
            actions.setItalic,
            actions.insertOrderedList,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.code,
            actions.line,
            actions.heading1,
            actions.heading2,
            actions.heading3,
            actions.heading4,
            actions.heading5,
            actions.heading6,
        ]}
        iconMap={{
            [actions.heading1] : ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>,
            [actions.heading2] : ({tintColor}) => <Text style={{color: tintColor}}>H2</Text>,
            [actions.heading3] : ({tintColor}) => <Text style={{color: tintColor}}>H3</Text>,
            [actions.heading4] : ({tintColor}) => <Text style={{color: tintColor}}>H4</Text>,
            [actions.heading5] : ({tintColor}) => <Text style={{color: tintColor}}>H5</Text>,
            [actions.heading6] : ({tintColor}) => <Text style={{color: tintColor}}>H6</Text>
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedIconTint={theme.colors.primaryDark}
        editor={editorRef}
        disabled={false}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        onChange={onChange}
        placeholder="What's on your mind?"
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
    richBar: {
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray,
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderBottomRightRadius: theme.radius.xl,
        borderBottomLeftRadius: theme.radius.xl,
        borderColor: theme.colors.gray,
        padding: 5,
    },
    contentStyle: {
        color: theme.colors.textDark,
        placeholderColor: "gray",
    },
    flatStyle: {
        paddingHorizontal: 8,
        gap: 3,
    }
});
