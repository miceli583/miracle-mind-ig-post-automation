export interface StylePreset {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  createdAt: string;
  dimensions: {
    width: number;
    height: number;
  };
  styles: {
    background: string;
    border: {
      gradient: string;
      radius: string;
      padding: string;
    };
    header: {
      title: {
        fontSize: string;
        fontWeight: string;
        color: string;
        lineHeight: string;
      };
      divider: {
        width: string;
        height: string;
        background: string;
      };
    };
    coreValue: {
      fontSize: string;
      fontWeight: string;
      color: string;
      prefix: string;
    };
    supportingValue: {
      fontSize: string;
      fontWeight: string;
      color: string;
      opacity: number;
      prefix: string;
    };
    quote: {
      fontSize: string;
      fontWeight: string;
      color: string;
      lineHeight: string;
      maxWidth: string;
    };
    author: {
      fontSize: string;
      fontWeight: string;
      color: string;
      opacity: number;
      prefix: string;
    };
    footer: {
      divider: {
        width: string;
        height: string;
        background: string;
      };
      handle: {
        fontSize: string;
        fontWeight: string;
        color: string;
        text: string;
      };
    };
  };
}

export const stylePresets: StylePreset[] = [
  {
    id: 'daily-anchor-1',
    name: 'Daily Anchor 1',
    description: 'Original "Today\'s Anchor" design with gradient border and golden dividers',
    archived: true,
    createdAt: '2025-08-26',
    dimensions: {
      width: 1080,
      height: 1350
    },
    styles: {
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      border: {
        gradient: 'linear-gradient(45deg, #40E0D0 0%, #C41E3A 25%, #D4AF37 50%, #C41E3A 75%, #40E0D0 100%)',
        radius: '24px',
        padding: '2px'
      },
      header: {
        title: {
          fontSize: '32px',
          fontWeight: '500',
          color: '#ffffff',
          lineHeight: '1.2'
        },
        divider: {
          width: '500px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)'
        }
      },
      coreValue: {
        fontSize: '36px',
        fontWeight: '400',
        color: '#ffffff',
        prefix: 'Core Value: '
      },
      supportingValue: {
        fontSize: '25px',
        fontWeight: '300',
        color: '#ffffff',
        opacity: 0.8,
        prefix: 'Supporting Value: '
      },
      quote: {
        fontSize: '68px',
        fontWeight: '300',
        color: '#ffffff',
        lineHeight: '1.3',
        maxWidth: '850px'
      },
      author: {
        fontSize: '20px',
        fontWeight: '300',
        color: '#cccccc',
        opacity: 0.8,
        prefix: '— '
      },
      footer: {
        divider: {
          width: '500px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)'
        },
        handle: {
          fontSize: '18px',
          fontWeight: '300',
          color: '#cccccc',
          text: '@miraclemind.live'
        }
      }
    }
  },
  {
    id: 'daily-anchor-2',
    name: 'Daily Anchor 2',
    description: 'Gold border variation of Daily Anchor design',
    archived: false,
    createdAt: '2025-08-26',
    dimensions: {
      width: 1080,
      height: 1350
    },
    styles: {
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      border: {
        gradient: '#D4AF37',
        radius: '24px',
        padding: '2px'
      },
      header: {
        title: {
          fontSize: '32px',
          fontWeight: '500',
          color: '#ffffff',
          lineHeight: '1.2'
        },
        divider: {
          width: '500px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)'
        }
      },
      coreValue: {
        fontSize: '36px',
        fontWeight: '400',
        color: '#ffffff',
        prefix: 'Core Value: '
      },
      supportingValue: {
        fontSize: '25px',
        fontWeight: '300',
        color: '#ffffff',
        opacity: 0.8,
        prefix: 'Supporting Value: '
      },
      quote: {
        fontSize: '68px',
        fontWeight: '300',
        color: '#ffffff',
        lineHeight: '1.3',
        maxWidth: '850px'
      },
      author: {
        fontSize: '20px',
        fontWeight: '300',
        color: '#cccccc',
        opacity: 0.8,
        prefix: '— '
      },
      footer: {
        divider: {
          width: '500px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)'
        },
        handle: {
          fontSize: '18px',
          fontWeight: '300',
          color: '#cccccc',
          text: '@miraclemind.live'
        }
      }
    }
  }
];

export const getStylePreset = (id: string): StylePreset | undefined => {
  return stylePresets.find(preset => preset.id === id);
};

export const getActiveStylePresets = (): StylePreset[] => {
  return stylePresets.filter(preset => !preset.archived);
};

export const getArchivedStylePresets = (): StylePreset[] => {
  return stylePresets.filter(preset => preset.archived);
};