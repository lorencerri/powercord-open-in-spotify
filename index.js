const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');
const { shorthand } = require('./manifest.json');

const MessageContent = getModule(
    m => m.type && m.type.displayName == 'MessageContent',
    false
);

module.exports = class OpenInSpotify extends Plugin {
    async startPlugin() {
        inject(shorthand, MessageContent, 'type', this.transformSpotifyLink);
    }

    transformSpotifyLink(e, res) {
        const children = res.props.children.find(c => Array.isArray(c));

        if (children) {
            for (var i = 0; i < children.length; i++) {
                // prettier-ignore
                if (!children[i].props?.href?.toLowerCase().includes('open.spotify.com')) continue;

                const url = children[i].props.href.split('/');

                if (!url[3] || !url[4]) continue;
                // prettier-ignore
                if (!['embed', 'search', 'local', 'playlist', 'user', 'starred', 'artist', 'album', 'track', 'episode'].includes(url[3].toLowerCase())) continue;

                children[i].props.href = `spotify:${url[3]}:${url[4]}`;
            }
        }

        return res;
    }

    pluginWillUnload() {
        uninject(shorthand);
    }
};
