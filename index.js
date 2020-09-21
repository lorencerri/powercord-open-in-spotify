const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');

const { ContextMenu } = require('powercord/components');
const { getOwnerInstance } = require('powercord/util');
const { name, shorthand } = require('./manifest.json');

module.exports = class MyPlugin extends Plugin {
    async startPlugin() {
        const MessageContent = await getModule(
            m => m.type && m.type.displayName == 'MessageContent'
        );

        inject(shorthand, MessageContent, 'type', this.transformSpotifyLink);
        /* inject(
            `${shorthand}-messages`,
            MessageContent,
            'type',
            ([event], res) => {
                const children = res.props.children.find(c => Array.isArray(c));
                const spotifyLinks = children.filter(
                    c =>
                        c.props &&
                        c.props.href &&
                        c.props.href.toLowerCase().includes('open.spotify.com')
                );

                for (var i = 0; i < spotifyLinks.length; i++) {
                    const url = spotifyLinks[i].props.href.split('/');
                    spotifyLinks[i].props.href = `spotify:${url[3]}:${url[4]}`;
                    console.log(spotifyLinks[i]);
                }

                return res;
            }
        );*/
    }

    transformSpotifyLink(e, res) {
        const children = res.props.children.find(c => Array.isArray(c));

        for (var i = 0; i < children.length; i++) {
            if (
                !children[i].props ||
                !children[i].props.href ||
                !children[i].props.href
                    .toLowerCase()
                    .includes('open.spotify.com')
            )
                continue;

            const url = children[i].props.href.split('/');
            children[i].props.href = `spotify:${url[3]}:${url[4]}`;
        }

        return res;
    }

    pluginWillUnload() {
        uninject(`${shorthand}-messages`);
    }
};
