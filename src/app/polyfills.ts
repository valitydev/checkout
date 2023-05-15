if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(searchValue, replaceValue) {
        // Escape special characters in the searchValue
        const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Create a regular expression with the escaped searchValue and the global flag
        const regex = new RegExp(escapedSearch, 'g');

        // Use the replace method with the regular expression to replace all occurrences
        return this.replace(regex, replaceValue);
    };
}
